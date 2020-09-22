const fs = require('fs');

var content = fs.readFileSync('first.json');

console.log(JSON.parse(content[0]['address']))
