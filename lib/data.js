// dependencies
const fs = require('fs');

const path = require('path');

const lib = {};

// base directory of the data folder

lib.basedir = path.join(__dirname, '../.data/');

lib.create = function (dir, file, data, callback) {
  // open file for writing
  fs.open(
    lib.basedir + dir + '/' + file + '.json',
    'wx',
    function (err1, fileDescription) {
      if (!err1 && fileDescription) {
        // convert data to string data
        const stringDAta = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescription, stringDAta, function (err) {
          if (!err) {
            fs.close(fileDescription, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing the new file!');
              }
            });
          } else {
            callback('Error writing to new file!');
          }
        });
      } else {
        callback("There was an error, file does'nt exit");
      }
    }
  );
};

// export module
module.exports = lib;
