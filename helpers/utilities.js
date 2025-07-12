// dependencies
const crypto = require('crypto');
const environments = require('./environments');

const utilities = {};

utilities.paseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};
utilities.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', environments.secretKey)
      .update(str)
      .digest('hex');
    return hash;
  }
  return false;
};

// create random string
utilities.createRandomString = (stringLength) => {
  let length = stringLength;
  length =
    typeof stringLength === 'number' && stringLength > 0 ? stringLength : false;
  if (length) {
    const possibilityCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';
    let output = '';
    for (let i = 1; i < length; i++) {
      const randomCharacter = possibilityCharacters.charAt(
        Math.floor(Math.random() * possibilityCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
