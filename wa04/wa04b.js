const { Client } = require('pg');
var async = require('async');  
const dotenv = require('dotenv');
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});  

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'stan';
db_credentials.host = 'data-structures.cz4rib340wda.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var addressesForDb = [{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"30 E 35TH ST New York NY ","Latitude":"40.7496221","Longitude":"-73.9855348"},{"address":"350 E 56TH ST New York NY ","Latitude":"40.757654","Longitude":"-73.963834"},{"address":"619 LEXINGTON AVE New York NY ","Latitude":"40.6894374","Longitude":"-73.9367705"},{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"28 E 35TH ST New York NY ","Latitude":"40.7496065","Longitude":"-73.9854965"},{"address":"350 E 56TH ST New York NY ","Latitude":"40.757654","Longitude":"-73.963834"},{"address":"283 LEXINGTON AVE New York NY ","Latitude":"40.7479969","Longitude":"-73.9783809"},{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"619 LEXINGTON AVE New York NY ","Latitude":"40.6894374","Longitude":"-73.9367705"},{"address":"141 E 43RD ST New York NY ","Latitude":"40.7518754","Longitude":"-73.9747248"},{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"141 E 43RD ST New York NY ","Latitude":"40.7518754","Longitude":"-73.9747248"},{"address":"209 MADISON AVE New York NY ","Latitude":"40.7486487","Longitude":"-73.9821254"},{"address":"122 E 37TH ST New York NY ","Latitude":"40.7483929","Longitude":"-73.9787906"},{"address":"619 LEXINGTON AVE New York NY ","Latitude":"40.6894374","Longitude":"-73.9367705"},{"address":"240 E 31ST ST New York NY ","Latitude":"40.7430963","Longitude":"-73.9780494"},{"address":"114 E 35TH ST New York NY ","Latitude":"40.7473169","Longitude":"-73.9800724"},{"address":"230 E 60TH ST New York NY ","Latitude":"40.7615607","Longitude":"-73.9649474"},{"address":"244 E 58TH ST New York NY ","Latitude":"40.7600925","Longitude":"-73.9653811"},{"address":"619 LEXINGTON AVE New York NY ","Latitude":"40.6894374","Longitude":"-73.9367705"},{"address":"325 PARK AVE New York NY ","Latitude":"40.7574552","Longitude":"-73.9733937"},{"address":"236 E 31ST ST New York NY ","Latitude":"40.74314","Longitude":"-73.9781525"},{"address":"308 E 55TH ST New York NY ","Latitude":"40.7576943","Longitude":"-73.9657436"},{"address":"244 E 58TH ST New York NY ","Latitude":"40.7600925","Longitude":"-73.9653811"},{"address":"244 E 58TH ST New York NY ","Latitude":"40.7600925","Longitude":"-73.9653811"},{"address":"109 E 50TH ST New York NY ","Latitude":"40.7569178","Longitude":"-73.97309"}];

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.Latitude + ", " + value.Longitude + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 