const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');
const { loadDocuments } = require('../../utils/db');     

const load = async (
  { file }, { db }
) => {

  // check if file exists
  if (fs.existsSync(file)) {

    // Read the input file
    fs.readFile(file, 'utf8', async (err, data) => {
      if (err) {
        console.log(chalk.hex('#cc0000').bold(`Error reading input file: ${err}`));
        process.exit(1);
      }

      let jsonData;
      try {
        // Parse the data as JSON
        jsonData = JSON.parse(data);
      } catch (error) {
        console.log(chalk.hex('#cc0000').bold(`Error parsing JSON: ${error}`));
        process.exit(1);
      }

      // Check if the parsed data is an array with at least one object
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.log(chalk.hex('#cc0000').bold(`Input file does not contain an array with at least one object.`));
        process.exit(1);
      }

      // Check the format of each object in the array
      for (const project of jsonData) {
        if (
          typeof project.title !== 'string' ||
          typeof project.description !== 'string' ||
          typeof project.longDescription !== 'string' ||
          !Array.isArray(project.authors) ||
          project.authors.some(author => (
            typeof author.name !== 'string' || typeof author.email !== 'string'
          ))
        ) {
          console.log(chalk.hex('#cc0000').bold(`Invalid format for at least one project object.`));
          process.exit(1);
        }
      }

      // All checks passed
      console.log();
      console.log('✅ Input file is a proper JSON file and conforms to the specified format.');

      // upload the documents
      throbber = ora({ text: 'Uploading documents, please wait' }).start();

      // add creation date to each document
      const updatedJsonData = jsonData.map(item => {
        return {
          ...item,
          created: new Date(),
        };
      });

      const docs = await loadDocuments(updatedJsonData, db);

      throbber.stopAndPersist({
        symbol: '\n✅',
        text: `${docs.insertedCount} documents successfully uploaded\n`,
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