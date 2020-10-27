//FINAL SCRAPING FILE
// npm install cheerio

// NS ID: N00725815

const fs = require('fs'),
    cheerio = require('cheerio'),
    querystring = require('querystring'),
    request = require('request'),
    async = require('async'),
    dotenv = require('dotenv');


var filelist = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];


filelist.forEach(element => {
    
    var html_file = fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/orig_html/'+String(element)+'.html');
    var $ = cheerio.load(html_file);
    var meetingsData =[];
    var addr = ''; // this variable will hold the lines of text
    
    //Select Meeting Html
    $('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr').each(function(i, elem) {
        addr = $(elem).html();
        
        // 1 Get Location Info
        // Use meetingLoc for attributes associated with the location
        var meetingLoc = $('td', addr).html();
    
        var locationName = $('h4',meetingLoc).text().replace(/^\s+|\s+$/gm,'').replace(/'/g,"");
        var meetingName = $('b',meetingLoc).text().replace(/^\s+|\s+$/gm,'').replace(/'/g,"");
        var stAddress = meetingLoc.split("<br>")[2].split(',')[0].split('- ')[0].split('(')[0].split('@')[0].replace("W.", 'West').replace("E.", 'East').replace("Strert", 'Street').split('Rm')[0].split('.')[0].replace("&apos;", '').replace("Central Park West &amp; 76th Street", '160 Central Park West').replace("Church of the Good Shepard", '543 Main Street').replace("502 West165th Street", '502 West 165th Street').replace("189th Street &amp; Bennett Avenue", '178 Bennett Avenue').replace("80 St", '80 Saint Marks Place').replace(/^\s+|\s+$/gm,'');
        var stAddressFull = meetingLoc.split("<br>")[2] + meetingLoc.split("<br>")[3].replace(/'/g,"");
        var meetingDetails = $('div',meetingLoc).text().replace(/'/g,"");
        var wheelChair = $('span',meetingLoc).text().replace(/^\s+|\s+$/gm,'').includes("alt=\"Wheelchair Access\"") ? "True" : "False";
        
        var stAddressFull = stAddressFull.replace(/^\s+|\s+$/gm,'').replace("\n","").replace(/,/g," ").replace(/(?:\r\n|\r|\n|\t)/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/&amp;/g, '&');
        var meetingDetails = meetingDetails.replace(/^\s+|\s+$/gm,'').replace("\n","").replace(/,/g," ").replace(/(?:\r\n|\r|\n|\t)/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/&amp;/g, '&');
        
        //2 get meeting times and details
        var meetingsHTML = $('td[style="border-bottom:1px solid #e3e3e3;width:350px;"]', addr).html();
        var meetingsList = meetingsHTML.replace(/^\s+|\s+$/gm,'').split("\n");
        var meetingsList = meetingsList.filter(val => val !== "<br>");
    
        var daytimeList = [];
            meetingsList.forEach(item => {
                var specialInterest = item.includes("Interest") ? item.split('Interest')[1].replace("</b>", "").replace(/^\s+|\s+$/gm,'') : "";
                var day = item.split('From')[0].replace("<b>", "").trim();
                var startTime = item.split('</b>')[1].replace(' <b>to','').replace(/^\s+|\s+$/gm,'');
                var endTime = item.split('</b>')[2].split('<br><b>')[0].replace(/^\s+|\s+$/gm,'');
                // var type = item.split('</b>')[3].split('=')[0].replace(/^\s+|\s+$/gm,'');
                var type = item.includes("Type") ? item.split('Type')[1].split('=')[1].split('meeting')[0].replace("</b>", "").replace(/^\s+|\s+$/gm,'') : "";
                
            daytimeList.push({"day": day, "start_time": startTime, "end_time": endTime, "type": type, "specialInterest": specialInterest});
            });
        
        
        daytimeList.forEach(item=> {
            meetingsData.push({
            "location": locationName,
            "meetingName": meetingName,
            "address": stAddress,
            "addressFull": stAddressFull,
            "meetingDetails": meetingDetails,
            "wheelChair": wheelChair,
            "day": item.day,
            "start_time": item.start_time,
            "end_time": item.end_time,
            "type": item.type,
            "specialInterest": item.specialInterest
        })});
        
        // var geoloc = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/data/geoloc/geoLocDistinct.json'));
        
        // // add geoloc data
        // var r = meetingsData.filter(({address: addressv}) => geoloc.every(({address: addressc}) => addressv !== addressc));
        // var newArr = geoloc.concat(r).map((v) => v.Latitude ? v : { ...v, Latitude: null});
        // var newArr1 = geoloc.concat(newArr).map((v) => v.Longitude ? v : { ...v, Longitude: null});
        // console.log(newArr1)
        // meetingsData.push({
            
        // })
    });

fs.writeFileSync('/home/ec2-user/environment/data-structures/wa07/data/'+String(element)+'.json', JSON.stringify(meetingsData));
// fs.writeFileSync('data/add_arry.json', JSON.stringify(meetingsData));
// fs.writeFileSync('/home/ec2-user/environment/data-structures/wa07/data/'+element+'.json', JSON.stringify(meetingsData));
});