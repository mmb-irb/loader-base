const crypto = require('crypto');

function generateUId() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  generateUId
}
