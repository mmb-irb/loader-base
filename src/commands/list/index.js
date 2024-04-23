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

  // sort by date in descending order
  docs.sort((a, b) => new Date(b.created) - new Date(a.created));

  const docsTable = docs.map(doc => {
    return {
        id: doc._id.toString(), // Convert ObjectId to string
        title: doc.title,
        description: doc.description,
        created: doc.created ? new Date(doc.created).toLocaleString() : '', // Convert Date to human-readable format
    }
  });

  if(docsTable.length > 0) console.table(docsTable);

  console.log()
  process.exit(0);

}

module.exports = list;