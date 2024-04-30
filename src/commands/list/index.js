const chalk = require('chalk');
const ora = require('ora');
const { listAllDocuments } = require('../../utils/db');     

const list = async (
  { last, first }, { db, bucket }
) => {

  console.log()
  throbber = ora({ text: 'Searching documents, please wait' }).start();

  const { docs, totalCount, msg } = await listAllDocuments(db, bucket, last, first)

  throbber.stopAndPersist({
    symbol: '✅',
    text: ` Showing ${docs.length} documents${totalCount > docs.length ? ' from a total of ' + totalCount : ''}.\n`,
  });

  if(msg) console.log(chalk.yellow(`⚠️  ${msg}\n`))

  // sort by date in descending order
  docs.sort((a, b) => new Date(b.created) - new Date(a.created));

  const docsTable = docs.map(doc => {
    return {
        id: doc.id,
        title: doc.title,
        files: doc.files,
        created: doc.created ? new Date(doc.created).toLocaleString() : '', // Convert Date to human-readable format
    }
  });

  if(docsTable.length > 0) console.table(docsTable);

  console.log()
  process.exit(0);

}

module.exports = list;