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

// read data from file

lib.read = (dir, file, callback) => {
  fs.readFile(
    `${lib.basedir + dir + '/' + file + '.json'}`,
    'utf8',
    (err, data) => {
      callback(err, data);
    }
  );
};

// update existing data
lib.update = (dir, file, data, callback) => {
  // file open for writing
  fs.open(
    lib.basedir + dir + '/' + file + '.json',
    'r+',
    (err, fileDescriptor) => {
      if ((!err, fileDescriptor)) {
        // convert data to string
        const stringData = JSON.stringify(data);

        fs.ftruncate(fileDescriptor, (err2) => {
          if (!err2) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err3) => {
              if (!err3) {
                // close the file
                fs.close(fileDescriptor, (err4) => {
                  if (!err4) {
                    callback(false);
                  } else {
                    callback('Error closing file!');
                  }
                });
              } else {
                callback('error writing to file');
              }
            });
          } else {
            console.log('error, truncating file');
          }
        });
      } else {
        console.log('Error, Updating file may not exist');
      }
    }
  );
};

// delete file

lib.delete = (dir, file, callback) => {
  fs.unlink(lib.basedir + dir + '/' + file + '.json', (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error, deleting file');
    }
  });
};

// export module
module.exports = lib;
