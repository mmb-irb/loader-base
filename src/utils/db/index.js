const pjson = require('../../../package.json');
const semver = require('semver');

const listAllDocuments = async(db, bucket, last, first) => {
    // get documents from the collection
    let docs

    const MAX_LIMIT = 100;
    const totalCount = await db.collection('documents').countDocuments();
    let msg = null;
    
    if(!last && !first) {
        // get all documents 
        if(totalCount > MAX_LIMIT) {
            docs = await db.collection('documents').find({}).sort({created: -1}).limit(10).toArray()
            msg = `Showing first ${MAX_LIMIT} documents. Use --last or --first to get more documents.`
        }
        else docs = await db.collection('documents').find({}).toArray()
    } else if(last) {
        const l = last > MAX_LIMIT ? MAX_LIMIT : last
        // get last N documents
        docs = await db.collection('documents').find({}).sort({created: -1}).limit(l).toArray()
        if(last > MAX_LIMIT) msg = `Showing last ${l} documents.`
    } else if(first) {
        const f = first > MAX_LIMIT ? MAX_LIMIT : first
        // get first N documents
        docs = await db.collection('documents').find({}).sort({created: 1}).limit(f).toArray()
        if(first > MAX_LIMIT) msg = `Showing first ${f} documents.`
    }

    // get number of gridFS files with document id
    docs = await Promise.all(docs.map(async(item) => {
        const filesCursor = await bucket.find({'metadata.id': item.id});
        const filesCount = await filesCursor.count();
        return {
          ...item,
          files: filesCount,
        };
    }));

    return {
        docs,
        totalCount,
        msg
    }
}

const removeSingleDocument = async(id, db, bucket) => {
    // remove document
    const res = await db.collection('documents').deleteOne({ id: id });

    // get all gridFS files with document id
    const filesCursor = await bucket.find({'metadata.id': id});
    const files = await filesCursor.toArray();

    // remove all gridFS files with document id
    for (const f of files) {
        await bucket.delete(f._id);
    }

    return res;
}

const removeAllDocuments = async(db) => {
    // remove all the transition related collections
    await db.collection('documents').deleteMany({});
    await db.collection('fs.files').deleteMany({});
    await db.collection('fs.chunks').deleteMany({});
}

const loadDocuments = async(docs, db) => {
    // insert documents
    const res = await db.collection('documents').insertMany(docs);
    return res;
}

const insertNewDocument = async (document, db) => {
    // insert single document
    const newTransition = await db.collection('documents').insertOne(document);

    return newTransition;
}

const findGridFSFile = async(id, db) => {
    return await db.collection('fs.files').findOne(id);
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
    if (semver.lt(mongodbVersion, '4.0.0')) mongoAuth.useUnifiedTopology = true;

    return mongoAuth;
}

module.exports = {
    listAllDocuments,
    removeSingleDocument,
    removeAllDocuments,
    loadDocuments,
    insertNewDocument,
    findGridFSFile,
    getMongoAuth
}