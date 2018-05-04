const fs = require('fs');
const util = require('util');
const csv = require('csv-parse');

const alphabet = 'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZáàảãạăắằẳẵặâấầẩẫậAÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬđĐéèẻẽẹêếềểễệÉÈẺẼẸÊẾỀỂỄỆíìỉĩịÍÌỈĨỊóòỏõọôốồổỗộơớờởỡợÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢúùủũụưứừửữựÚÙỦŨỤƯỨỪỬỮỰýỳỷỹỵÝỲỶỸỴ';
const common = ' ,;.-\\\'';
const number = '1234567890';

function validateVietnamese(stringToValidate) {
    const validChar = [];
    const invalidChar = [];
    for (i = 0; i < stringToValidate.length; i++) { 
        char = stringToValidate[i]; 
        if (alphabet.includes(char) || common.includes(char) || number.includes(char) ) { 
            validChar.push(char);
        } else {
            invalidChar.push(char);
        }
    }
    if (stringToValidate.length === validChar.length) {
        return 'valid'
    } else {
        return {invalidString:stringToValidate, 
                invalidChar:invalidChar}
    }
}

const encodingTablePath = __dirname+ '/encoding_table.csv';
const encodingMatches = {};
fs.createReadStream(encodingTablePath)
    .pipe(csv({
        columns:true
    }))
    .on('data', (csvrow) => {
        encodingMatches[csvrow.TCVN3]=[csvrow.Viet,csvrow['UnicodeHex']]
    })
    .on('end', () => {
        const inputFilePath = __dirname + '/' + process.argv[2];
        const inputFileRead = fs.readFileSync(inputFilePath);
        const inputFile = JSON.parse(inputFileRead);
        cleanedPlaces = [];
        inputFile.features.filter((f) => f && f.properties).forEach((place) => {
            validation = validateVietnamese(place.properties.NAME_3);
            if (validation !== 'valid') {
                charInvalid = validation.invalidChar;
                charInvalid.forEach( (replaceChar) => {
                    if (Object.keys(encodingMatches).includes(replaceChar)) {
                        place.properties.NAME_3 = place.properties.NAME_3.replace(replaceChar, encodingMatches[replaceChar][0])
                    }
                });
            }
            cleanedPlaces.push(place)
        })
        inputFile.features = cleanedPlaces;
        
        outFilepath = inputFilePath.split('.')[0]+'_cleaned.geojson'
        fs.writeFileSync(outFilepath,JSON.stringify(inputFile));
    })
    


