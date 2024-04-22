const chalk = require('chalk');
const ora = require('ora');
const { listAllDocuments } = require('../../utils/db');     

const list = async (
  {  }, { db }
) => {

  console.log()
  throbber = ora({ text: 'Searching documents, please wait' }).start();

  const docs = await listAllDocuments(db)

  throbber.stopAndPersist({
    symbol: '✅',
    text: ` ${docs.length} documents successfully found:\n`,
  });

  const docsTable = docs.map(doc => {
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description,
      created: doc.created,
    }
  })

  if(docsTable.length > 0) console.table(docsTable);

  console.log(chalk.cyan(`\nProcess finished\n`))
  process.exit(0);

}

module.exports = list;