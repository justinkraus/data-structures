var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
});

var dynamodb = new AWS.DynamoDB();

            // Table Fields
            // "Release_ID":  entry.Release_ID,
            // "Artist_Name": entry.Artist_Name,
            // "Release_Title":  entry.Release_Title,
            // "Release_Rating": entry.Release_Rating,
            // "Review_Content": entry.Review_Content,
            // "Release_Year": entry.Release_Year,
            // "Tags": entry.Tags,
            // "Discogs_URL": entry.Discogs_URL,
            // "Video_Array": entry.Video_Array,
            // "Spotify_ID": entry.Spotify_ID


var params = {
    TableName : "jkzone2",
    KeyConditionExpression: "placeholder_id = :placeholder_id",
    FilterExpression: 'Release_Rating >= :rating',
    ExpressionAttributeValues: {
        ":placeholder_id": {S: "123"},
        ":rating": {N: "5"}
}};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});