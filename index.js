#!/usr/bin/env node

const yargs = require('yargs');
// These 2 lines alone allow all scripts to access the env file through process.env
const genDotenvLoad = require('dotenv').config({ path: `${__dirname}/.env` });
if (genDotenvLoad.error) throw genDotenvLoad.error;

const commonHandler = require('./src');
if (process.argv.includes('--help')) {
  const asciiArt = require('./src/utils/logo');
  asciiArt();
}

yargs
    .scriptName('index.js')
    .usage('$0 <cmd> [args]')
    .command({
        command: 'load <file>',
        desc:
            'Upload documents to database',
        builder: yargs =>
            yargs
                .positional('file', {
                    type: 'string',
                    default: '',
                    describe: 'Path to JSON file containing documents to upload'
                }),
        handler: commonHandler('load')
    })
    .command({
      command: 'remove [-d] [-y]',
      desc:
          'Remove list of documents from database',
      builder: yargs =>
          yargs
              .option('d', {
                  alias: 'documents',
                  type: 'array',
                  default: [],
                  demand: true,
                  describe: 'Document(s) id\'s to remove'
              })
              .option('y', {
                alias: 'yes',
                describe: 'Remove document(s) without confirmation',
                default: false,
                type: 'boolean',
              }),
      handler: commonHandler('remove')
  })
    .command({
      command: 'list',
      desc:
          'Lists all documents from database',
      handler: commonHandler('list')
    })
    .demandCommand(1)
    .strict()
    .help()
    .argv
