const { ObjectId } = require('mongodb');
const pjson = require('../../../package.json');

const listAllDocuments = async(db) => {
    // get all documents from the collection
    const docs = await db.collection('documents').find({}).toArray()
    return docs;
}

const removeSingleDocument = async(id, db) => {
    // Check if id is a valid 24 hex characters string
    if (!ObjectId.isValid(id)) {
        return { invalid: true, item: id };
    }

    // remove document
    const res = await db.collection('documents').deleteOne({ _id: new ObjectId(id) });
    return res;
}

const loadDocuments = async(docs, db) => {
    // insert documents
    const res = await db.collection('documents').insertMany(docs);
    return res;
}

// checks mongodb version
function isGreaterOrEqual(v1, v2) {
    const [major1, minor1, patch1] = v1.split('.').map(Number);
    const [major2, minor2, patch2] = v2.split('.').map(Number);

    if (major1 > major2) return true;
    if (major1 < major2) return false;

    if (minor1 > minor2) return true;
    if (minor1 < minor2) return false;

    if (patch1 >= patch2) return true;
    if (patch1 < patch2) return false;
}

// returns mongo authentication object
const getMongoAuth = () => {
    let mongoAuth = {};
    if (!process.env.DB_LOGIN || !process.env.DB_PASSWORD) {
        // connecting to mongo without authentication
        mongoAuth = {
            connectTimeoutMS: 0,
            socketTimeoutMS: 0, // In order to avoid Mongo connection time out
        };
    } else {
        // connecting to mongo with authentication
        mongoAuth = {
            auth: {
                user: process.env.DB_LOGIN,
                password: process.env.DB_PASSWORD,
            },
            authSource: process.env.DB_AUTHSOURCE,
            connectTimeoutMS: 0,
            socketTimeoutMS: 0, // In order to avoid Mongo connection time out
        };
    }

    // check if mongodb version is greater or equal to 4.0.0 and useUnifiedTopology is available
    mongodbVersion = pjson.dependencies.mongodb.replace(/[^0-9.]/g, '');
    if (!isGreaterOrEqual(mongodbVersion, '4.0.0')) mongoAuth.useUnifiedTopology = true;

    return mongoAuth;
}

module.exports = {
    listAllDocuments,
    removeSingleDocument,
    loadDocuments,
    getMongoAuth
}