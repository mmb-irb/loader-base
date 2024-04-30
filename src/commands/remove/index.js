const chalk = require('chalk');
const ora = require('ora');
const readline = require('readline');
const { removeSingleDocument } = require('../../utils/db');     

const remove = async (
  { documents, yes }, { db, bucket }
) => {

  if (documents.length === 0) {
    console.error(chalk.red(`\nPlease provide at least a single document\n`));
    process.exit(1);
  }

  let promises = [];
  let removed = 0;
  let invalid = [];

  const removeDoc = async (doc) => {

    const res = await removeSingleDocument(doc, db, bucket);

    if (res.invalid) invalid.push(res.item);
    else {
      if(res.deletedCount) removed++;
      else invalid.push(doc);
    }

    return res;
  }

  const removeProcess = async () => {
    console.log()
    throbber = ora({ text: 'Removing documents, please wait', spinner: 'monkey' }).start();

    for await(const d of documents) {

      promises.push(removeDoc(d))

    }

    await Promise.all(promises)

    if(removed > 0) {
      throbber.stopAndPersist({
          symbol: '✅',
          text: `${removed} document successfully removed\n`,
      });
    } else {
      throbber.stop();
    }

    if(invalid.length > 0) console.log(chalk.yellow(`⚠️  Warning! The following transitions were not found in the database: ${invalid.join(', ')}\n`))

    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const recursiveAsyncReadLine = (q) => {
    rl.question(`${q}`, async(answer) => {
        if(answer.toUpperCase() === 'Y') {  

          removeProcess();

        } else if(answer.toLowerCase() === 'n') {
          console.log(chalk.red('Process closed by user'));
          process.exit(0);
        } else {
          recursiveAsyncReadLine('Only [Y] or [n] accepted! ')
        }
    });
  }

  if(!yes) {
    console.log()
    recursiveAsyncReadLine('Are you sure? This action will remove all the provided documents [Y/n] ');
  } else {
    removeProcess();
  }  

}

module.exports = remove;