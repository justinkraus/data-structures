# Weekly Assignment 2

The purpose of this script is to parse an html file for the street addresses of AA meetings and save these as line-seperated items in a text file. The script builds on the example starter code [provided here](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_02.md) with changes detailed below.

### Complete Script
```
var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('m05.html');

var $ = cheerio.load(content);

var addr = '';

$('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1)').each(function(i, elem) {
    addr += ($(elem).text()).replace(/^\s+|\s+$/gm,'').split("\n");
});

var addr_arry = addr.split(',');

var addr_arry_st = addr_arry.filter(name => name.match(/^\d+\b/))

var addr_arry_b = addr_arry_st.map(function(x){ return x.replace(/ *\([^\]]*\)/, '') })

console.log(addr_arry_b)

var add_arry_text = addr_arry_b.join('\n');

fs.writeFileSync('data/add_arry_text.txt', add_arry_text);
```
## Script Explained
### Loading Data
The codeblock reads the previously saved html file (see [wa01](https://github.com/justinkraus/data-structures/tree/master/wa01) for background) with filesync and loads the data into the Cheerio Module. [Cheerio](https://cheerio.js.org/) here will be used to parse through the HTML structure and target the stress addresses.

```
var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('m05.html');

var $ = cheerio.load(content);

var addr = '';
```
### Initial Parse
The cheerio module has numerous options for parsing HTML objects. For this exercise I used the [Inspect Tool](https://developers.google.com/web/tools/chrome-devtools/dom) in Chrome on the 'm05' html page to get the path of one street address element. The final path below was slightly modified to ensure it could be used to target all of the street addresses. Due to the structure of the page this was as specific I could get to target the street addresses, using this path did pick-up additional text which needed to be seperated.
```
$('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1)')
```
Cheerio has a built-in function ".each" that allows the user to parse every instance of that path on the table. The function that follows ".each" takes the iterations ("i") for that element and passes them to the "addr" variable originally declared in the Loading Data section above.

```
$('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1)').each(function(i, elem) {
    addr += ($(elem).text()).replace(/^\s+|\s+$/gm,'').split("\n");
});
```
The final piece of this codeblock takes each text element and trims for whitespace and then splits the elements by the newline character. I used the replace method over trim() as trim continued to return unneeded whitespace. Splitting by newline was an initial seperation of information and started to segment the street addresses.
```
($(elem).text()).replace(/^\s+|\s+$/gm,'').split("\n")
```

### Cleaning Text
The next section of code focuses on cleaning and further seperating the text to contain only the individual street addresses. First an additional split by comma was necessary to segment the text blocks into pieces that contained only the street addresses.

```
var addr_arry = addr.split(',');
```
After that each street address was stored as an individual array item but the overall array included additional information. I recognized a pattern to filter on array items that begin with a number and have no text following the number. This was needed to eliminate non street address lines that had items like "250th" in them. This code largely completed localizing the street addresses.

```
var addr_arry_st = addr_arry.filter(name => name.match(/^\d+\b/))
```

The next regex replaced any text in parenthesis. This was needed for a single street address that included the word "(Basement)" in it.

```
var addr_arry_b = addr_arry_st.map(function(x){ return x.replace(/ *\([^\]]*\)/, '') })
```

### Saving Files
An additional newline character ('\n') was joined to each item in the array to save the items in the text file as addresses on individual lines. However if further processing was needed in javascript it would likely use the addr_arry_b variable above to enable usage of array methods for any additional analysis.
```
var add_arry_text = addr_arry_b.join('\n');

fs.writeFileSync('data/add_arry_text.txt', add_arry_text);
```

### Update After Original Post
Added in an additional line to JSON.stringify() the array variable to ensure the output text file could be processed by the API in wa03.

```
fs.writeFileSync('data/addr_arry_js.txt', JSON.stringify(addr_arry_b));
```