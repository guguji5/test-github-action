const path = require('path');
const fs = require('fs');
const outputPath = path.resolve('./', 'output.json');
const argv = key => {
    // Return true if the key exists and a value is defined
    if ( process.argv.includes( `--${ key }` ) ) return true;
  
    const value = process.argv.find( element => element.startsWith( `--${ key }=` ) );
  
    // Return null if the key does not exist and a value is not defined
    if ( !value ) return null;
    
    return value.replace( `--${ key }=` , '' );
}

const printLog = str =>{
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    fs.writeFile(outputPath, str, null, () => {});
}
module.exports = {argv, printLog}