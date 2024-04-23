const chalk = require('chalk');
const process = require('process');
const mongodb = require('mongodb');
const ora = require('ora');
const { getMongoAuth } = require('./utils/db');   

const commonHandler = commandName => async argv => {

    let throbber;
    let db;

    // CTRL+C CONTROLLER
    process.on('SIGINT', async () => {
        console.log(chalk.red('\nProcess interrupted by user'));
        process.exit(0);
    });

    try {
        // CHECK IF MONGODB CONNEXION
        try {
            if (process.env.MODE === 'testing') {
                client = await mongoMemory;
            } else {

                throbber = ora('Checking DB connexion').start();

                client = await mongodb.MongoClient.connect(
                    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`,
                    getMongoAuth()
                );

                // Get the main database
                db = client.db(process.env.DB_DATABASE);

                if(db) {
                    throbber.stopAndPersist({
                        symbol: '\n✅',
                        text: ` DB connexion successfully established`,
                    });
                }

            }
        } catch (error) {
            throbber.stopAndPersist({
                symbol: '❌',
                text: `Unable to connect to mongo instance or to database`,
            });
            console.error(chalk.red(`${error}`));
            process.exit(1);
            //throw new Error(`\nUnable to connect to mongo instance or to database`);
        }


        const command = require(`./commands/${commandName}`);

        const finalMessage = await command(
            // 'argv' is a normal object passed from yargs library
            // This object contains the input values of options and positionals from the command
            // e.g. in load command, argv contains the values of {file, c}
            argv,
            // Also include extra stuff useful across all scripts
            { db }
        );

        if (finalMessage) finalMessage();

    } catch (error) {
        console.log(error)
    } finally {
        // In any case, error or not, end session and close client
        //if (session) session.endSession(); // End mongo client session
        //if (client && client.close) client.close(); // End mongo client
        //process.exit(0); // Exit the node shell. The '0' argument stands for success
        /*console.log('ended!!')
        process.exit(0);*/
    }

}
module.exports = commonHandler;