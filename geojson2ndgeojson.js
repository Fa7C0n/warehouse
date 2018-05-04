const fs = require('fs');
const util = require('util');

const inputFilePath = __dirname + '/' + process.argv[2];
const inputFileRead = fs.readFileSync(inputFilePath);
const inputFile = JSON.parse(inputFileRead);

const outFile = inputFilePath.split('.')[0]+'.geojsonl';
let counter = 0;
inputFile.features.forEach((place) => {
    fs.appendFileSync(outFile, JSON.stringify(place) + '\n', {encoding: 'utf8'})
    counter = counter+1;
    console.log(counter, '.' , place.properties.NAME_3);
});