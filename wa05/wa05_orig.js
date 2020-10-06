var blogEntries = [];

class BlogEntry {
  constructor(Release_ID, Artist_Name, Release_Title, Release_Rating, Review_Content, Release_Year, Tags, Discogs_URL, Video_Array, Spotify_ID) {
    this.Release_ID = {};
    this.Release_ID.N = Release_ID.toString();
    this.Artist_Name = {}; 
    this.Artist_Name.S = Artist_Name;
    this.Release_Title = {}; 
    this.Release_Title.S = Release_Title;
    this.Release_Rating = {};
    this.Release_Rating.N = Release_Rating.toString();    
    this.Review_Content = {};
    this.Review_Content.S = Review_Content;
    this.Release_Year = {};
    this.Release_Year.N = Date(Release_Year);
    this.Tags = {};
    this.Tags = Tags.split(",");
    this.Discogs_URL = {};
    this.Discogs_URL.S = Discogs_URL;
    this.Video_Array = {};
    this.Video_Array = Video_Array.split(",");
    this.Spotify_ID = {}; 
    this.Spotify_ID.S = Spotify_ID;
  }
}

blogEntries.push(new BlogEntry(9753136,'D∆WN','Infrared',2,escape('D∆WN - Infrared Post-Blackheart I have high expectations for any Dawn Richard release but they aren’t met here; especially surprising given this is produced by Kingdom whose production is too bloated for her style. Gone is Dawn’s clever lyricism from Blackheart which was at times abstract, metaphorical and personal. Infrared is thematically promising but never really goes anywhere.'),2017,"RnB/Swing , Electronic , Hip Hop ","https://www.discogs.com/DWN-Infrared/release/9753136","https://www.youtube.com/watch?v=1fwTBtizw4Q, https://www.youtube.com/watch?v=Fqvo72bMLNU, https://www.youtube.com/watch?v=B6Kf55y7WQk","Not on Spotify"));
blogEntries.push(new BlogEntry(10514404,"Toro Y Moi","Boo Boo",3,escape("﻿I have major respect for chaz's diverse and prolific output, he's always pushing himself in a new direction. The few things I've actively listened to in the past haven't held me but I like this album: hip, poppy electro with a loner vibe."),2017,"Synth-pop , Electronic , Hip Hop , Funk / Soul","https://www.discogs.com/Toro-Y-Moi-Boo-Boo/release/10514404","https://www.youtube.com/watch?v=9rPOuZ4vY50, https://www.youtube.com/watch?v=Fg7r4kQUbPw, https://www.youtube.com/watch?v=huA5-ViXEoo","39dY6cEFXDEevnfUTzp6lZ"));
blogEntries.push(new BlogEntry(2496677,"Everything But The Girl","Idlewild",2,escape("ï»¿A varied album of what I think of as adult contemporary. The use of a drum machine on some tracks I thought hampered the preciousness and authenticity that hangs around the rest of the album. Consistent with the rest of their catalog there are standout pop tracks with beautiful lyrics to be found but I prefer other albums of theirs."),1988,"Pop Rock , Pop ","https://www.discogs.com/Everything-But-The-Girl-Idlewild/release/2496677","https://www.youtube.com/watch?v=IttYGmIOtQY, , ","3GhOahAXfC5V87uwTkK75T"));

console.log(blogEntries);

/// iam role name: data-structures

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};
params.Item = blogEntries[0]; 
params.TableName = "jkzone";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});


var blogEntries = [{9753136,'D∆WN','Infrared',2,escape('D∆WN - Infrared Post-Blackheart I have high expectations for any Dawn Richard release but they aren’t met here; especially surprising given this is produced by Kingdom whose production is too bloated for her style. Gone is Dawn’s clever lyricism from Blackheart which was at times abstract, metaphorical and personal. Infrared is thematically promising but never really goes anywhere.'),2017,"RnB/Swing , Electronic , Hip Hop ","https://www.discogs.com/DWN-Infrared/release/9753136","https://www.youtube.com/watch?v=1fwTBtizw4Q, https://www.youtube.com/watch?v=Fqvo72bMLNU, https://www.youtube.com/watch?v=B6Kf55y7WQk","Not on Spotify"},
{10514404,"Toro Y Moi","Boo Boo",3,escape("﻿I have major respect for chaz's diverse and prolific output, he's always pushing himself in a new direction. The few things I've actively listened to in the past haven't held me but I like this album: hip, poppy electro with a loner vibe."),2017,"Synth-pop , Electronic , Hip Hop , Funk / Soul","https://www.discogs.com/Toro-Y-Moi-Boo-Boo/release/10514404","https://www.youtube.com/watch?v=9rPOuZ4vY50, https://www.youtube.com/watch?v=Fg7r4kQUbPw, https://www.youtube.com/watch?v=huA5-ViXEoo","39dY6cEFXDEevnfUTzp6lZ"},
{2496677,"Everything But The Girl","Idlewild",2,escape("ï»¿A varied album of what I think of as adult contemporary. The use of a drum machine on some tracks I thought hampered the preciousness and authenticity that hangs around the rest of the album. Consistent with the rest of their catalog there are standout pop tracks with beautiful lyrics to be found but I prefer other albums of theirs."),1988,"Pop Rock , Pop ","https://www.discogs.com/Everything-But-The-Girl-Idlewild/release/2496677","https://www.youtube.com/watch?v=IttYGmIOtQY, , ","3GhOahAXfC5V87uwTkK75T"}
]

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