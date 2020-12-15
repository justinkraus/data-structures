//used code here to add items: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.02.html
//google search of "put json to dynamodb javascript led me there"

var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing entries into DynamoDB. Please wait.");

var allEntries = JSON.parse(fs.readFileSync('jkzone_reviews1.json', 'utf8'));
allEntries.forEach(function(entry) {
    var params = {
        TableName: "jkzone2",
        Item: {
            "placeholder_id": entry.placeholder_id,
            "Release_ID":  entry.Release_ID,
            "Artist_Name": entry.Artist_Name,
            "Release_Title":  entry.Release_Title,
            "Release_Rating": entry.Release_Rating,
            "Review_Content": entry.Review_Content,
            "Release_Year": entry.Release_Year,
            "Tags": entry.Tags,
            "Discogs_URL": entry.Discogs_URL,
            "Video_Array": entry.Video_Array,
            "Spotify_ID": entry.Spotify_ID
            
        }
    };
 
    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add entry", entry.Release_Title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", entry.Release_Title);
       }
    });
    
});
