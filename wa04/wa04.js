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

// create aalocations table for address info:
var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat decimal, long decimal);";
// create meetinglist table for additional meeting info:
// var thisQuery1 = "CREATE TABLE meetinglist (meetingtitle varchar(200), address varchar(100), addressnotes varchar(200), meetingtimestart time, meetingtimeend time, specialinterest varchar(100), wheelchair boolean, meetingtype varchar(50));";


// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});