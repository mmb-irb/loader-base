const chalk = require('chalk');
const pjson = require('../../../package.json');
// app 'logo' in ascii art
const asciiArt = () => {

    console.log( "" ) 
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("                                                         ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("   @@@@@@@@@@@@    _     ___   ____  ___                 ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("  @@@@@@@@@@@@@@  | |   / _ \\ / ___|/ _ \\                ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("  @@@@@@@@@@@@@@  | |  | | | | |  _| | | |               ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("  @@@@@@@@@@@@@@  | |__| |_| | |_| | |_| |               ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("  @@@@@@@@@@@@@@  |_____\\___/ \\____|\\___/                ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("  @@@@@@@@@@@@@@                                         ") )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold(`   @@@@@@@@@@@@  © ${new Date().getFullYear()} Genís Bayarri, Adam Hospital     `) )
    console.log( chalk.hex('#555555').bgHex('#dd4d29')(`                 v${pjson.version}                                  `) )
    console.log( chalk.hex('#555555').bgHex('#dd4d29').bold("                                                         ") )
    console.log( "" )   

}

module.exports = asciiArt;