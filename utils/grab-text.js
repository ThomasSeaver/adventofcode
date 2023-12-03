const fs = require('fs')

const grabText = (filename) => {
    return fs.readFileSync(filename, (err, output) => {
        if (err) throw err;
        return output.toString().trim();
     }).toString().trim();
     
}

module.exports = {grabText};