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

// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM meetinglist1;";

// Updated script per google form for assignment questioning number of rows
// var thisQuery = "SELECT COUNT(*) FROM meetinglist1"

// // check if table exists
// var thisQuery = "select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = 'meetinglist1';"

// final assignment related additions

// duplicate meetlinglist table

// var thisQuery = "CREATE TABLE meetinglist1 AS SELECT * FROM meetinglist;"

// add new column for integer value of days

// var thisQuery = `ALTER TABLE meetinglist1
//                     ADD COLUMN daynum INTEGER;
//                 UPDATE meetinglist1
//                 SET daynum = CASE
//                     WHEN day = 'Mondays' THEN 1
//                     WHEN day = 'Tuesdays' THEN 2
//                     WHEN day = 'Wedensdays' THEN 3
//                     WHEN day = 'Thursdays' THEN 4
//                     WHEN day = 'Fridays' THEN 5
//                     When day = 'Saturdays' THEN 6
//                     When day = 'Sundays' THEN 7
//                  END;`;

// add new column for integer value of hours
//2nd answer here: https://stackoverflow.com/questions/12916611/extract-hour-in-24-hour-format

//add new 'hournum' column with value as integer
// var thisQuery = `ALTER TABLE meetinglist1 ADD COLUMN hournumstr varchar(255);`

// var thisQuery = "UPDATE meetinglist1 SET hournumstr = to_char(start_time, 'HH24');";

//other attempts that didn't work
// var thisQuery = "UPDATE meetinglist1 SET hournumstr = to_char(start_time, 'HH24') WHERE start_time is NULL AND start_time IS NOT NULL;";
// var thisQuery = `UPDATE meetinglist1 SET hournumstr = CASE
//                     WHEN start_time = NOT NULL THEN to_char(start_time, 'HH24')
//                     END;`;
// var thisQuery = `UPDATE meetinglist1 SET hournumstr =  substr(start_time, 1,2);`;


client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});