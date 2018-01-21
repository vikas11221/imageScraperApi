var fs = require('fs');

/**
 * delete the directory
 * 
 * @param {Array} path - path of the folder to be deleted
 * @returns {Array} filelist - Array of promises(containing local path to converted images)
*/
module.exports = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};