const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const { generateUId } = require('../../utils/common'); 
const { checkJsonFormat } = require('../../utils/json');
const { insertNewDocument } = require('../../utils/db'); 
const { getFilesPaths, uploadFiles } = require('../../utils/system/fs');     

const load = async (
  { file }, { db, bucket }
) => {

  let throbber;
  let counter = 1;

  const createNewDocument = async (document, total_documents) => {

    // generate unique id for this document (used as folder name for files)
    const id = generateUId()

    throbber.text = `Uploading files for ${document.title} document (${chalk.hex('#f36a5a').bold(counter)} / ${chalk.hex('#f36a5a').bold(total_documents)})`

    // get files paths
    const filesPaths = await getFilesPaths(document.files);

    // uploadFiles
    const filesIds = await uploadFiles(filesPaths, id, db, bucket);

    // connect filesIds to document
    const doc = {
      id: id,
      ...document,
      files: filesIds,
      created: new Date(),
    };

    // insert document
    const nd = insertNewDocument(doc, db)

    counter++;

    return nd
  }

  // check if file exists
  if (fs.existsSync(file)) {

    // Read the input file
    fs.readFile(file, 'utf8', async (err, data) => {
      if (err) {
        console.log(chalk.hex('#cc0000').bold(`Error reading input file: ${err}`));
        process.exit(1);
      }

      // check if the input file is a valid JSON file
      const checkJSON = checkJsonFormat(data);

      // if the input file is not a valid JSON file, print the error and exit
      if(checkJSON.error) {
        console.log(chalk.hex('#cc0000').bold(checkJSON.message));
        process.exit(1);
      }

      // if the input file is a valid JSON file, get the JSON data
      const jsonData = checkJSON.jsonData;

      // All checks passed
      console.log();
      console.log('✅ Input file is a proper JSON file and conforms to the specified format.');

      // upload the documents
      throbber = ora({ text: 'Uploading documents, please wait' }).start();

      // loop through the JSON data and create a new document for each
      for (const doc of jsonData) {
        await createNewDocument(doc, jsonData.length)
      }

      throbber.stopAndPersist({
        symbol: '\n✅',
        text: `${counter - 1} documents successfully uploaded\n`,
      });

      process.exit(0);
    });

  } else {
    console.log()
    console.log(chalk.hex('#cc0000').bold('ERROR! Correct file path must be provided!'))
    process.exit(1);
}

}

module.exports = load;