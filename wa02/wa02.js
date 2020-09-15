// npm install cheerio

// NS ID: N00725815

var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis html file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('m05.html');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// write the street addresses of meeting locations to a text file
var addr = ''; // this variable will hold the lines of text

//multi-function expression:
//locate the street addresses by using the path of the element in the html file and take each of the matches of the path and add them to the blank addr variable
//next, for each element, used a replace function instead of trim to remove white space as trim was still leaving some
//split text on new-line characters
//
$('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1)').each(function(i, elem) {
    addr += ($(elem).text()).replace(/^\s+|\s+$/gm,'').split("\n");
});

//further split the resulting text by comma
var addr_arry = addr.split(',');

//regex matches for lines that start with a number and have no text following (ie 250th)
var addr_arry_st = addr_arry.filter(name => name.match(/^\d+\b/))

//regex negated matching on text in parenthesis to replace with empty text
//only used for one street address which had the word basement in it
//got started here: https://stackoverflow.com/questions/25776973/javascript-regex-remove-text-between-square-brackets
var addr_arry_b = addr_arry_st.map(function(x){ return x.replace(/ *\([^\]]*\)/, '') })

console.log(addr_arry_b)

fs.writeFileSync('data/addr_arry.txt', addr_arry_b);