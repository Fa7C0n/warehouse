const fs = require('fs');
const ndjson = require('ndjson');

const inputFilePath = __dirname + '/' + process.argv[2];

let counter = 0;

const inputFileRead = fs.createReadStream(inputFilePath)
    .pipe(ndjson.parse())
    .on('data', (obj) => {
        console.log(obj)
    })


// const inputFile = JSON.parse(inputFileRead);