#! /usr/bin/env node

/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var sys = require('sys');
var rest = require('restler');
var http = require('http');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://shielded-fjord-3933.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(infile) {
    rest.get(infile).on('complete', function(result) { fs.writeFileSync("myfile.html", result);});
    var infile2 = "myfile.html";
    var instr = infile2.toString();

// Removing File Not Exist Portion
//#####################################
//       if(!fs.existsSync(instr)) {
//           console.log("%s does not exist. Exiting.", infile);
//           process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
//       }
//#####################################
   return instr;
};


//###Another asserURLExist Version####
/*
var assertURLExists = function(infile) { 
    var instr = rest.get(infile).on('complete', function(result) { sys.puts(result);});
    return instr;
};
*/
//#####################################

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioURL = function(url) { 
    return cheerio.load(url);
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkURL = function(url, checkURL) {
    $ = cheerioURL(url);
    var checks = loadChecks(checkURL).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <checkfile>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url>', 'Path to url', clone(assertURLExists), URL_DEFAULT)
        .option('-f, --file <htmlfile>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .parse(process.argv);

        if (program.optiom === '-u' || '--url') {
          var checkJson = checkURL(program.url, program.checks);  
          var outJson = JSON.stringify(checkJson, null, 4);
        }        
        
        if (program.option === '-f' || '--file') {
          var checkJson = checkHtmlFile(program.file,program.checks);
          var outJson = JSON.stringify(checkJson, null, 4);
        }
        console.log(outJson);
        fs.unlink("./myfile.html", function(err) { console.log("");});
}

//exports.checkHtmlFile = checkHtmlFile;
//exports.checkURL = checkURL;
        




