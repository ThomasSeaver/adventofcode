const { grabText } = require('../../utils/grab-text');
const text = grabText(`${__dirname}/i1.txt`);

let sum = 0;
for (const line of text.trim().split('\n')) {
    let firstNumber = null;
    let lastNumber = null;
    for (const character of line) {
        if (Number.isInteger(parseInt(character))) {
            if (firstNumber === null) {
                firstNumber = parseInt(character);
            }
            lastNumber = parseInt(character);
        }
    }    
    sum += parseInt(`${firstNumber}${lastNumber}`)
}   
console.log(sum);