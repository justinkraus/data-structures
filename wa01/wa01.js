// npm install request
// mkdir data

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

//siteList.forEach(element => console.log(element));

siteList.forEach(element => request(element, function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/wa01/data/' + String(element).substring(23), body);
    }
    else {console.log("Request failed!")}
}));