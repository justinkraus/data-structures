const { Client } = require('pg');  
const dotenv = require('dotenv');
const cTable = require('console.table');
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

// Sample SQL statement to query the entire contents of a table: 
var allQuery = "SELECT * FROM aalocations;";

// Updated script per google form for assignment questioning number of rows
var allCount = "SELECT COUNT(*) FROM aalocations"

// Select latitude and longitude ranges
var adrPoint = "SELECT * FROM aalocations WHERE (lat BETWEEN 40.5 and 40.8) AND (long BETWEEN -73.97 and -73.94)";


// Execute the query by changing 'thisQuery'
client.query(adrPoint, (err, res) => {
    if (err) {throw err}
    else{
    console.table(res.rows);
    client.end();
    }
});