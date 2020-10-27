"use strict"

const fs = require('fs'),
      querystring = require('querystring'),
      request = require('request'),
      async = require('async'),
      dotenv = require('dotenv');

//inner join formula
//https://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i/17500836
const equijoin = (xs, ys, primary, foreign, sel) => {
    const ix = xs.reduce((ix, row) => ix.set(row[primary], row), new Map);
    return ys.map(row => sel(ix.get(row[foreign]), row));
};

dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});
//comment from class: If the path is relative, it should generalise to most people’s directory: “~/data-structures/.env”

const API_KEY = process.env.API_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'


// var filelist = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];
var filelist = ['m10'];
var addresses = [];
var tamuData = [];

filelist.forEach(element => {
    
    var jsonFile = fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/data/'+String(element)+'.json');
    
    var jsonData = JSON.parse(jsonFile);
    var meetingsData = []
    var meetingsData = meetingsData.push(jsonData)
    // console.log(meetingsData)
    console.log(jsonData.addresses)
    
    
    for(var i = 0; i < jsonData.length; i++){
        addresses.push(jsonData[i].address)
    }
    console.log(addresses)
    
        // geocode addresses
        
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
                
                var tamuAddress = tamuGeo['InputAddress']['StreetAddress']
                var tamuLat = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']
                var tamuLon = tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']

                
                tamuData.push({"address": value, "tamuAddress": tamuAddress, "latitude": tamuLat, "longitude": tamuLon});
                console.log(tamuData)
                
                // tamuData.forEach(item=> {
                //     addresses.push({
                //     "origAddress": value,
                //     "tamuAddress": item.tamuAddress,
                //     "latitude": item.latitude,
                //     "longitude": item.longitude
                // })});
                
            });
            

            
            console.log(JSON.stringify(tamuData))
            
        
            // sleep for a couple seconds before making the next request
            setTimeout(callback, 2000);
        }, function() {
            fs.writeFileSync('data/geolocnew/'+String(element)+'geoLoc.json', JSON.stringify(tamuData));
            console.log('*** *** *** *** ***');
            console.log(`Number of meetings in this zone: ${tamuData.length}`);
            
            var geoJSON= fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/data/geolocnew/'+String(element)+'geoLoc.json');
            var geoData = JSON.parse(geoJSON);
            
            const result = equijoin(jsonData, geoData, "address", "address",
            ({location, meetingName, address, addressFull, meetingDetails, wheelChair, day, start_time, end_time, type, specialInterest}, {tamuAddress, latitude, longitude}) => ({location, meetingName, address,tamuAddress, latitude, longitude, addressFull, meetingDetails, wheelChair, day, start_time, end_time, type, specialInterest}));    

            console.log(result);

            fs.writeFileSync('/home/ec2-user/environment/data-structures/wa07/data/geolocComb/'+String(element)+'geoLocComb.json', JSON.stringify(result));
            
})});

