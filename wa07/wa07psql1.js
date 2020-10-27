const { Client } = require('pg');  
const dotenv = require('dotenv');
var async = require('async');  
var fs = require('fs');
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'stan';
db_credentials.host = 'data-structures.cz4rib340wda.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
// const client = new Client(db_credentials);
// client.connect();


var meetingJson = JSON.parse(fs.readFileSync('data/geolocComb/m10geoLocComb.json'));
// console.log(meetingJson)
// fs.writeFileSync('/home/ec2-user/environment/data-structures/wa07/test.txt', JSON.stringify(meetingJson));

async.eachSeries(meetingJson, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO meetinglist VALUES (\
    E'" + value.location.replace("'","''") + "',\
    E'" + value.meetingName.replace("'","''") + "',\
    E'" + value.address + "',\
    E'" + value.tamuAddress + "',\
    E'" + value.latitude + "',\
    E'" + value.longitude + "',\
    E'" + value.addressFull + "',\
    E'" + value.meetingDetails + "',\
    " + value.wheelChair + ",\
    E'" + value.specialInterest + "',\
    E'" + value.day + "',\
    E'" + value.start_time + "',\
    E'" + value.end_time  + "',\
    E'" + value.type + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
