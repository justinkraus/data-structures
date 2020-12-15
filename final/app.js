var express = require('express'), 
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');
const cTable = require('console.table');
const dotenv = require('dotenv');
var multer  = require('multer');
dotenv.config({path: '/home/ec2-user/environment/data-structures/.env'});  

//added for request
// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var upload = multer({ dest: 'uploads/' });

// app.use(express.urlencoded({extended: false}));

// const indexSource = fs.readFileSync("templates/sensor.txt").toString();
const indexSource = fs.readFileSync("templates/sensorLine.html").toString();
var template = handlebars.compile(indexSource, { strict: true });

// const pbSource = fs.readFileSync("templates/pb.txt").toString();
const pbSource = fs.readFileSync("templates/pb.html").toString();
var pbtemplate = handlebars.compile(pbSource, { strict: true });

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'stan';
db_credentials.host = 'data-structures.cz4rib340wda.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
 <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" href="css/styles.css?v=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
       integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
       crossorigin=""/>
</head>
<body>
<div id="mapid"></div>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoianVzdHN0YW4iLCJhIjoiY2tlc3hncWJ4MWh3cTJ4cXY5ZmsxdmoyYiJ9.LHycdQ3Il_MDxeW8JfiNWw'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].latitude, data[i].longitude] ).bindPopup(JSON.stringify(data[i].meetings)).addTo(mymap);
    }
    </script>
    </body>
    </html>`;


app.get('/', function(req, res) {
    res.send('<h3>Justin Kraus Final Projects</h3><ul><li><a href="/aa">aa meetings</a></li><li><a href="/temperature">temp sensor</a></li><li><a href="/processblog">process blog</a></li></ul>');
}); 

// respond to requests for /aa
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 
    // var now1 = moment.tz(Date.now(), "America/New_York").format('HH:mm:ss'); 
    // var hourr = now1.toString(); 
    // console.log(now)
    console.log(dayy)
    console.log(typeof hourr)

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
                    //                             
    var thisQuery = `SELECT latitude, longitude, daynum, hournumstr, json_agg(json_build_object('loc', location, 'address', address, 'time', start_time, 'name', meetingName, 'day', day, 'types', type)) as meetings
                 FROM meetinglist1
                 WHERE daynum = ` + dayy + 'and CAST(hournumstr AS int) >= ' + hourr +  
                 `GROUP BY latitude, longitude, daynum, hournumstr
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            console.log(qres, qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

app.get('/temperature', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    // works
    // var q = `SELECT * FROM sensorData WHERE sensorvalue BETWEEN 10 AND 75;`;
    var q = `SELECT * FROM sensorData WHERE sensorvalue BETWEEN 10 AND 75 ORDER BY sensortime DESC LIMIT 10080;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.end(template({ sensordata: JSON.stringify(qres.rows)}));
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
}); 

app.get('/processblog', upload.none(), function(req, res) {
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // console.log('Body- ' + JSON.stringify(req.body));
    
    // var ratingNum = res.body;
    
    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 
    console.log(dayy)
    console.log(hourr)
    
    function rateNum(dayy) {
        let result;
        if ((dayy == 1)) {
            result = "1";
        }
        else if ((dayy == 2)) {
            result = "2";
        }
        else if ((dayy == 3)) {
            result = "3";
        }
        else if ((dayy == 4)) {
            result = "4";
        }
        else if ((dayy >= 5)) {
            result = "5";
        }
        return result;
    }
    
    var ratingNum = rateNum(dayy)
    console.log(ratingNum)
    // var ratingNum = "5"

    // DynamoDB (NoSQL) query
    var params = {
        TableName : "jkzone2",
        KeyConditionExpression: "placeholder_id = :placeholder_id",
        FilterExpression: 'Release_Rating = :rating',
        ExpressionAttributeValues: {
            ":placeholder_id": {S: "123"},
            // ":rating": {N: "5"}
            ":rating": {N: ratingNum}
    }};

    //table is filtered in params becomes data
    //gets passed to the pbtemplate html file
    //ends as pbdata which is picked up in pb.html
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            throw (err);
        }
        else {
            // console.log(data.Items)
            res.end(pbtemplate({ pbdata: JSON.stringify(data.Items)}));
            console.log('3) responded to request for process blog data');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server listening...');
});