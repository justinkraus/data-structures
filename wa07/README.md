# Weekly Assignment 7

The purpose of these scripts is to parse all of the information from the individual AA meeting location pages for incorporation into a PostgreSQL database. This information will eventually be used to complete the new version of the AA meeting location finder. 

This assignment has mulitple parts each with their own challenges. While the final output here is shown, this was very much an itterative process that involved revising my approach throughout the assignment. I've broken up the assignment into four components:
1. Parse the Original HTML files (wa07d.js)
2. Obtaining Geolocation Information (wa07geo2.js)
3. Create Final Datastructure and PostgreSQL Tables (wa07psql1.js)
3. Load Data into PostgreSQL Table (wa07psql.js)


## 1. Parse the Original HTML files
The primary challenge of this section is the problematic structure of the original AA meeting pages. [The original files can be found here](https://parsons.nyc/aa/m02.html) and upon inspection its apparent that the apparent visual table structure is inconsistent in the html. Additionally specific text items needed for the assignment aren't easily divided from each other, requiring me to take a very close look at patterns that could be used to parse the information.

###Iterating html files and targeting table rows with cheerio
Each html file was loaded independently. I located the table row items using Chrome Inspect and copying the selectors, modifying it to a 'tr' value that could be used for each location 

```javascript
var filelist = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];

filelist.forEach(element => {
    var html_file = fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/orig_html/'+String(element)+'.html');
    var $ = cheerio.load(html_file);
    var meetingsData =[];
    var addr = ''; // this variable will hold the lines of text
    
    //Select Meeting Html
    $('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr').each(function(i, elem) {
```

### Obtaining Meeting Location Information
Using the previous selector, I target table data for each meeting location shown as 'meetingLoc'. Using this, I further parsed the necessary information into specific variables for each necessary piece of information pertaining to a specific meeting location. These are denoted as var below where each line targets a specific html element shown as $('htmlelement'). For certain elements I needed to add a split to ensure the appropriate information was returned.

A lot of text standardization and cleanup is shown here following the '.text()' portions of code. This process was highly iterative and manual throughout various portions of the assignment, some of this realized during the load of data into the PostreSQL database which cannot accept certain escape characters or byte order marks (invisible text).

```javascript
        addr = $(elem).html();
        
        var meetingLoc = $('td', addr).html();
    
        var locationName = $('h4',meetingLoc).text().replace(/^\s+|\s+$/gm,'').replace(/'/g,"");
        var meetingName = $('b',meetingLoc).text().replace(/^\s+|\s+$/gm,'').replace(/'/g,"");
        var stAddress = meetingLoc.split("<br>")[2].split(',')[0].split('- ')[0].split('(')[0].split('@')[0].replace("W.", 'West').replace("E.", 'East').replace("Strert", 'Street').split('Rm')[0].split('.')[0].replace("&apos;", '').replace("Central Park West &amp; 76th Street", '160 Central Park West').replace("Church of the Good Shepard", '543 Main Street').replace("502 West165th Street", '502 West 165th Street').replace("189th Street &amp; Bennett Avenue", '178 Bennett Avenue').replace("80 St", '80 Saint Marks Place').replace(/^\s+|\s+$/gm,'');
        var stAddressFull = meetingLoc.split("<br>")[2] + meetingLoc.split("<br>")[3].replace(/'/g,"");
        var meetingDetails = $('div',meetingLoc).text().replace(/'/g,"");
        var wheelChair = $('span',meetingLoc).text().replace(/^\s+|\s+$/gm,'').includes("alt=\"Wheelchair Access\"") ? "True" : "False";
        
        var stAddressFull = stAddressFull.replace(/^\s+|\s+$/gm,'').replace("\n","").replace(/,/g," ").replace(/(?:\r\n|\r|\n|\t)/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/&amp;/g, '&');
        var meetingDetails = meetingDetails.replace(/^\s+|\s+$/gm,'').replace("\n","").replace(/,/g," ").replace(/(?:\r\n|\r|\n|\t)/g, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/&amp;/g, '&');
```

### Obtaining Meeting Time and Location Information
Perhaps the most frustrating design decision in the original html structure, specific meeting information isn't linked to a location in a straight-forward way. I targeted a second html attribute shown in the meetingsHTML variable and split on newline characters to get a list of individual meetings at a location. I parsed each of these list items in a similar manner as the location information and pushed them to an empty array. 

```javascript
 var meetingsHTML = $('td[style="border-bottom:1px solid #e3e3e3;width:350px;"]', addr).html();
        var meetingsList = meetingsHTML.replace(/^\s+|\s+$/gm,'').split("\n");
        var meetingsList = meetingsList.filter(val => val !== "<br>");
    
        var daytimeList = [];
            meetingsList.forEach(item => {
                var specialInterest = item.includes("Interest") ? item.split('Interest')[1].replace("</b>", "").replace(/^\s+|\s+$/gm,'') : "";
                var day = item.split('From')[0].replace("<b>", "").trim();
                var startTime = item.split('</b>')[1].replace(' <b>to','').replace(/^\s+|\s+$/gm,'');
                var endTime = item.split('</b>')[2].split('<br><b>')[0].replace(/^\s+|\s+$/gm,'');
                // var type = item.split('</b>')[3].split('=')[0].replace(/^\s+|\s+$/gm,'');
                var type = item.includes("Type") ? item.split('Type')[1].split('=')[1].split('meeting')[0].replace("</b>", "").replace(/^\s+|\s+$/gm,'') : "";
                
            daytimeList.push({"day": day, "start_time": startTime, "end_time": endTime, "type": type, "specialInterest": specialInterest});
            });
```

### Linking Meeting Information with Location Information
In my first iteration (not shown) I parsed this information into an individual object that I then added as an iunner (nested) object to the meeting location information. While this was successful during the parsing stage, it became problematic when I went to add the information to the PostgreSQL table which does not have a straightforward way to digest nested JSON. I revised this by reversing the sequence: instead of adding an meeting details object to each location I added location information to each individual meeting. This was done through a forEach loop on the array object created in the previous section using references to variable names. The remaining portion of code wrote this all to a standalone JSON file.

```javascript
daytimeList.forEach(item=> {
            meetingsData.push({
            "location": locationName,
            "meetingName": meetingName,
            "address": stAddress,
            "addressFull": stAddressFull,
            "meetingDetails": meetingDetails,
            "wheelChair": wheelChair,
            "day": item.day,
            "start_time": item.start_time,
            "end_time": item.end_time,
            "type": item.type,
            "specialInterest": item.specialInterest
})});
```

## 2. Obtaining Geolocation Information
Each meeting location needs to have geolocation (latitude and longitude) coordinates assigned for displaying on a map. Obtaining this information through an API is detailed [in week 3](https://github.com/justinkraus/data-structures/tree/master/wa03) but some changes were made to the process to reflect the updated meeting structure detailed in the previous section. 

The API calls are returned and added to a tamuData array that contains the original address parsed from the AA meeting page and information provided by the API which is then saved to a standalone json file as done in week 3.

```javascript
tamuData.push({"address": value, "tamuAddress": tamuAddress, "latitude": tamuLat, "longitude": tamuLon});
```

### Joining Geolocation Info
To link the new geolocation information to the original, I used a function I found on stackoverflow shown as equijoin. This links the original meeting JSON file with the geolocation information by address. This combined object is then saved as a new JSON file which has all meeting information which is in the data/geolocComb directory.


```javascript
const equijoin = (xs, ys, primary, foreign, sel) => {
    const ix = xs.reduce((ix, row) => ix.set(row[primary], row), new Map);
    return ys.map(row => sel(ix.get(row[foreign]), row));
};

var geoJSON= fs.readFileSync('/home/ec2-user/environment/data-structures/wa07/data/geolocnew/'+String(element)+'geoLoc.json');
var geoData = JSON.parse(geoJSON);
            
const result = equijoin(jsonData, geoData, "address", "address",
            ({location, meetingName, address, addressFull, meetingDetails, wheelChair, day, start_time, end_time, type, specialInterest}, {tamuAddress, latitude, longitude}) => ({location, meetingName, address,tamuAddress, latitude, longitude, addressFull, meetingDetails, wheelChair, day, start_time, end_time, type, specialInterest}));    

fs.writeFileSync('/home/ec2-user/environment/data-structures/wa07/data/geolocComb/'+String(element)+'geoLocComb.json', JSON.stringify(result));
```

## 3. Create Final Datastructure and PostgreSQL Tables
In [week 04](https://github.com/justinkraus/data-structures/tree/master/wa04) I created a proposed datastructure based on my understanding of the data at the time. The final fields used is similar however the geolocation information is now included on the primary meetinglist table. I chose this datastructure as it compliments the approach described in the 'joining geolocation' section where each meeting has all of the supporting information associated with it. This leads to a certain redundancy in the table structure where meeting location information is repeated but that was not a concern for this database size, ultimately I believe it will be easier to write queries around.

```javascript
CREATE TABLE meetinglist (location varchar(200), meetingName varchar(200), address varchar(100), tamuAddress varchar(100), latitude decimal, longitude decimal, addressFull varchar(200), meetingDetails varchar(200), wheelChair boolean, specialInterest varchar(100), day varchar(20), start_time time, end_time time, type varchar(30));";
```

## 4. Load Data into PostgreSQL Table
The final script loads a row for each meeting into the PostgreSQL table, an approach that expands on the [week 04](https://github.com/justinkraus/data-structures/tree/master/wa04) exercise. This was an iterative process that resulted in retooling the original parsing script as issues with escape characters and byte order marks impacted the PostgreSQL load. Ultimately all meetings were loaded successfully!

```javascript
async.eachSeries(meetingJson, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO meetinglist VALUES (\
    E'" + value.location.replace("'","''") + "',\
    E'" + value.meetingName.replace("'","''") + "',\
    E'" + value.address + "',\
    E'" + value.tamuAddress + "',\
    E'" + value.latitude + "',\
    E'" + value.longitude + "',\
    E'" + value.addressFull + "',\
    E'" + value.meetingDetails + "',\
    " + value.wheelChair + ",\
    E'" + value.specialInterest + "',\
    E'" + value.day + "',\
    E'" + value.start_time + "',\
    E'" + value.end_time  + "',\
    E'" + value.type + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
```