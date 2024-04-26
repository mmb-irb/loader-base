const chalk = require('chalk');
const ora = require('ora');
const readline = require('readline');
const { removeAllDocuments } = require('../../utils/db');              

const clean = async (
    {  }, { db }
) => {
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const recursiveAsyncReadLine = (q) => {
        rl.question(`${q}`, async(answer) => {
            if(answer.toUpperCase() === 'Y') {
                
                console.log()
                const throbber = ora({ text: 'Removing database, please wait', spinner: 'monkey' }).start();

                await removeAllDocuments(db)

                throbber.stopAndPersist({
                    symbol: '✅',
                    text: ` Database successfully removed`,
                });

                console.log(chalk.cyan('Process finished'))
                process.exit(0);

            } else if(answer.toLowerCase() === 'n') {
                console.log(chalk.red('Process closed by user'));
                process.exit(0);
            } else {
                recursiveAsyncReadLine('Only [Y] or [n] accepted! ')
            }
        });
    }

    console.log()
    recursiveAsyncReadLine('Are you sure? This action will remove all the database documents [Y/n] ');

}

module.exports = clean;