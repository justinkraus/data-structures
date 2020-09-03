# Weekly Assignment 1

This script builds on the example starter code [provided here](https://github.com/visualizedata/data-structures/blob/master/weekly_assignment_01.md) to parse the individual urls and save them as text files.

### Complete Script
```
var request = require('request');
var fs = require('fs');

var siteList = ['https://parsons.nyc/aa/m01.html',
            'https://parsons.nyc/aa/m02.html',
            'https://parsons.nyc/aa/m03.html',
            'https://parsons.nyc/aa/m04.html',
            'https://parsons.nyc/aa/m05.html',
            'https://parsons.nyc/aa/m06.html',
            'https://parsons.nyc/aa/m07.html',
            'https://parsons.nyc/aa/m08.html',
            'https://parsons.nyc/aa/m09.html',
            'https://parsons.nyc/aa/m10.html'
            ];

siteList.forEach(element => request(element, function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/' + String(element).substring(23), body);
    }
    else {console.log("Request failed!")}
}));
```
## Changes explained
### URL Array
Added variable 'siteList' to script which contains an array of the individual urls

```
var siteList = ['https://parsons.nyc/aa/m01.html',
            'https://parsons.nyc/aa/m02.html',
            'https://parsons.nyc/aa/m03.html',
            'https://parsons.nyc/aa/m04.html',
            'https://parsons.nyc/aa/m05.html',
            'https://parsons.nyc/aa/m06.html',
            'https://parsons.nyc/aa/m07.html',
            'https://parsons.nyc/aa/m08.html',
            'https://parsons.nyc/aa/m09.html',
            'https://parsons.nyc/aa/m10.html'
            ];
```
### forEach Method
The built-in array method forEach() is used to execute a function for each url element within the siteList array, documentation of this method can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).
```
siteList.forEach(element => request(element, function(error, response, body)
```
This takes the siteList array variable, uses the forEach method to pass each element within the array to the request function provided in the original sample code. The url in the original sample code is replaced with "element" to reference the individual array elements in the forEach method.

### Saving Files
Saved individual files using filename convention that combines the filepath with the array element name (the url of the file). Removed unnecessary text by using the subtring method documented [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring).

```
fs.writeFileSync('/home/ec2-user/environment/data/' + String(element).substring(23), body);
```


