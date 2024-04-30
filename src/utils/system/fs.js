const fs = require('fs');
const path = require('path');
const { findGridFSFile } = require('../db');

const mimeMap = new Map([['.pdb', 'chemical/x-pdb'], ['.crd', 'application/octet-stream'], ['.mdcrd', 'application/octet-stream'], ['.dat', 'text/plain']]);

const getFilesPaths = async (files) => {

  const paths = [];

  for(f of files) {
    if (fs.existsSync(f.path)) paths.push(f.path)
  }

  return paths;

}

const getMimeTypeFromFilename = pth => {
  for (const [extension, type] of mimeMap.entries()) {
      if (path.basename(pth).toLowerCase().endsWith(extension)) return type;
  }
  // default
  return 'application/octet-stream';
};

const streamToFile = (uploadStream, filepath) => {
  return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createReadStream(filepath).pipe(uploadStream)
      fileWriteStream
          .on('finish', resolve)
          .on('error', reject)
  })
}

const uploadSingleFile = async(bucket, filepath, id, db) => {

  //const ids = [];
  // get filename replacing .crd extension by .mdcrd
  const filename = path.basename(filepath);

  //console.log('Uploading file: ', filename);

  // upload to gridFS
  const uploadStream = await bucket.openUploadStream(`${id}/${filename}`, {
      contentType: getMimeTypeFromFilename(filepath),
      chunkSizeBytes: 1048576,
      metadata: { id: id, filename: filename }
  });

  // wait until file uploaded
  await streamToFile(uploadStream, filepath)
  // check if file exists
  const fileDescriptor = await findGridFSFile(uploadStream.id, db)
  // if exists, return
  if(fileDescriptor !== null) {
      return {
          id: fileDescriptor._id,
          file: path.basename(filepath)
      }
  }

  return null;

}

const uploadFiles = async (paths, id, db, bucket) => {

  let ids = [];
  const promises = [];

  for (const filepath of paths) {
      ids.push(await uploadSingleFile(bucket, filepath, id, db))
  }

  return ids
    
}

module.exports = {
  getFilesPaths,
  uploadFiles
}