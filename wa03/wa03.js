"use strict"

const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});

const API_KEY = process.env.API_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = ["122 East 37th Street","30 East 35th Street","350 East 56th Street","619 Lexington Avenue","122 East 37th Street","28 East 35th Street","350 East 56th Street ","283 Lexington Avenue","122 East 37th Street","619 Lexington Avenue","141 East 43rd Street","122 E 37TH St.","122 East 37th Street","141 East 43rd Street","209 Madison Avenue","122 East 37th Street","619 Lexington Avenue","240 East 31st Street","114 East 35th Street","230 East 60th Street ","244 East 58th Street","619 Lexington Avenue","325 Park Avenue","236 EAST 31st STREET ","308 East 55th Street","244 East 58th Street","244 East 58th Street","109 East 50th Street"];
// let addresses = ["122 East 37th Street","30 East 35th Street","350 East 56th Street"]

// eachSeries in the async module iterates over an array and operates on each item in the array in series
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

    // construct a querystring from the `query` object's values and append it to the api URL
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
    


    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/addGeoLoc.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});