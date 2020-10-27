const { Client } = require('pg');  
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'stan';
db_credentials.host = 'data-structures.cz4rib340wda.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

            // "location": locationName,
            // "meetingName": meetingName,
            // "address": stAddress,
            // "addressFull": stAddressFull,
            // "meetingDetails": meetingDetails,
            // "wheelChair": wheelChair,
            // specialInterest
            // day
            // startTime
            // endTime
            // type

// var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat decimal, long decimal);";
// create meetinglist table for additional meeting info:
// var thisQuery = "CREATE TABLE meetinglist (location varchar(200), meetingName varchar(200), address varchar(100), tamuAddress varchar(100), latitude decimal, longitude decimal, addressFull varchar(200), meetingDetails varchar(200), wheelChair boolean, specialInterest varchar(100), day varchar(20), start_time time, end_time time, type varchar(30));";

//// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE meetinglist;"; 

// // Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM meetinglist;";

// // Updated script per google form for assignment questioning number of rows
var thisQuery = "SELECT COUNT(*) FROM meetinglist"

// // check if table exists
// var thisQuery = "select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = 'meetinglist';"

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});