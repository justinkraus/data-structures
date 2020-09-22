# Weekly Assignment 3
## Getting Geo Locations of Addresses from the TAMU GeoServices API

The purpose of this script is to take the array of addresses parsed from the page in weekly assignment 2 and send these to the Texas A&M University (TAMU) for Latitude and Longitude information.

### Complete Script
```
const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});

const API_KEY = process.env.API_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

let meetingsData = [];
let addresses = ["122 East 37th Street","30 East 35th Street","350 East 56th Street","619 Lexington Avenue","122 East 37th Street","28 East 35th Street","350 East 56th Street ","283 Lexington Avenue","122 East 37th Street","619 Lexington Avenue","141 East 43rd Street","122 E 37TH St.","122 East 37th Street","141 East 43rd Street","209 Madison Avenue","122 East 37th Street","619 Lexington Avenue","240 East 31st Street","114 East 35th Street","230 East 60th Street ","244 East 58th Street","619 Lexington Avenue","325 Park Avenue","236 EAST 31st STREET ","308 East 55th Street","244 East 58th Street","244 East 58th Street","109 East 50th Street"];

async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01",
        allowTies: false,
    };

    let apiRequest = API_URL + '?' + querystring.stringify(query);

    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        
        var obj = new Object();
        obj.address = tamuGeo['InputAddress']['StreetAddress']
        obj.Latitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']
        obj.Longitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']
        
        console.log(obj)
    
        meetingsData.push(obj);
    });
    
    console.log(JSON.stringify(meetingsData))
    

    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/addGeoLoc.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
```

### Calling the API
#### API Key in .env
An API Key is required to use the [TAMU GeoServices API](http://geoservices.tamu.edu/Services/Geocode/WebService/). The first part of the exercise focuses on saving the API key in the .env 
and leveraging gitignore to ensure this value isn't shared on github. 
```
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
const API_KEY = process.env.API_KEY;
```

#### Constructing the API Query
The next section of code focuses on providing the information necessary to call the API Key. The URL shown below is the base URL for making requests to the TAMU GeoServices API.
```
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'
```
The 'meetingsData' variable is a placeholder empty array to eventually provide the results into. The 'addresses' variable shown below represents a subset of the addresses parsed in weekly assignment 2 (full list provided in the addr_arry_js.txt file).
```
let meetingsData = [];
let addresses = ["122 East 37th Street","30 East 35th Street","350 East 56th Street"]
```
This portion of the API query uses the async module to go through each entry in the addresses array for inclusion in a javascript object 'query'. 
The 'eachseries' method of the async module is leveraged over other methods (such as the array prototype method 'foreach') as it waits for each iteration of the async operation to complete
before moving to the next. 
```
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01",
        allowTies: false,
    };
```
The final portion of code takes the base API URL and combines it with the query object to form the entire request to TAMU GeoServices API. The 'querystring.string' method is used to
convert the query object to values accepted by the API in the form of a Url. 
I appreciate this method since it avoids sending incorrect string formats and can be applied universally to API requests in JavaScript.

```
let apiRequest = API_URL + '?' + querystring.stringify(query);
```

#### Sending a Request to the API
A request is made to the API using the request module and API inputs previously formatted. The body of the response is parsed using the JSON.parse method.
The API returns a lot of additional information not needed for this exercise, [examples are shown in the API Examples section here](http://geoservices.tamu.edu/Services/Geocode/WebService/). 
To focus on the necessary attributes, I created a new object 'obj'
and targeted only the values I needed from the API response: street address, latitude, and longitude. These were each assigned to keys denoted in the code, for example address
was assigned to obj.address which saves the output as {address: "123 fake-street"}.

These results are input into the empty meetingsData variable declared earlier using the array.push method.

```
    request(apiRequest, function(err, resp, body) {
        if (err){ throw err; }

        let tamuGeo = JSON.parse(body);
        
        var obj = new Object();
        obj.address = tamuGeo['InputAddress']['StreetAddress']
        obj.Latitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']
        obj.Longitude = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']
        
        console.log(obj)
    
        meetingsData.push(obj);
    });
    
    console.log(JSON.stringify(meetingsData))
```

## Saving the Data
A sleep timer of 2 seconds was added to ensure there were no issues with API rate limits. Each object was saved into a new JSON file to be usable for future work. 
```
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/addGeoLoc.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});
```

