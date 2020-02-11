const fs = require('fs');

const deleteFile = (filePath) => {

    //deletes the file in the given path
    fs.unlink(filePath, (err)=> {
        if(err) {
            throw(err);
        }
    })
}

exports.deleteFile = deleteFile;