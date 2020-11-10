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

// var thisQuery = "CREATE TABLE sensorData ( sensorValue double precision, sensorTime timestamp DEFAULT current_timestamp );";

//// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE sensorData;"; 

// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM sensorData;";

// // Updated script per google form for assignment questioning number of rows
// var thisQuery = "SELECT COUNT(*) FROM sensorData"

// // check if table exists
// var thisQuery = "select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = 'sensorData';"

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});