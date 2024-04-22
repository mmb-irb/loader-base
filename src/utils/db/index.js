const { ObjectId } = require('mongodb');

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
    const res = await db.collection('documents').deleteOne({ _id: ObjectId(id) });
    return res;
}

const loadDocuments = async(docs, db) => {
    // insert documents
    const res = await db.collection('documents').insertMany(docs);
    return res;
}

module.exports = {
    listAllDocuments,
    removeSingleDocument,
    loadDocuments
}