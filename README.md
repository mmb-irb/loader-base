# Basic loader

This is the source code of a basic Node.js loader.

## Requirements

Have Node.js and npm installed and working

## Installation

**Before init the installation**, please modify the **version of mongodb** in **package.json** to fit it with the MongoDB version to which it has to connect.

`npm install`

### `.env` file fields

⚠️ No sensible default value is provided for any of these fields, they **need to be defined** ⚠️

An `.env` file must be created in the project root. The file `git.env` can be taken as an example. The file must contain the following environment variables (the DB user needs to have writing rights):

| key              | value   | description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| DB_LOGIN         | string  | db user                                         |
| DB_PASSWORD      | string  | db password                                     |
| DB_HOST          | `<url>` | url of the db server                            |
| DB_PORT          | number  | port of the db server                           |
| DB_DATABASE      | string  | name of the dbcollection                        |
| DB_AUTHSOURCE    | string  | authentication db                               |

## Run script

### help

`node . --help`

A help menu will be displayed, please follow the instructions provided by the help.

### load

`node . load file.json`

Upload data contained in file.json to the database.

### remove

`node . remove -d id1 id2 id3`

Remove items from database by document id.

### list

`node . list`

List of all the items stored in the database.

## Credits

Genís Bayarri, Adam Hospital.

## Copyright & licensing

This website has been developed by the [MMB group](https://mmb.irbbarcelona.org) at the [IRB Barcelona](https://irbbarcelona.org).

© 2024 **Institute for Research in Biomedicine**

Licensed under the **Apache License 2.0**.