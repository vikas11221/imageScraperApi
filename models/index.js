const fs = require("fs")
var models = {}

/**
 * Get all models from model dir.
 * 
 * @param {String} dir - name of dir
 * @returns {Object} filelist - list of model files
*/
var walkSync = function (dir, filelist) {
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file + '/', filelist);
        }
        else {
            filelist.push(dir + "/" + file);
        }
    });
    return filelist;
};

walkSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file.indexOf("index.js") === -1);
    })
    .forEach(function (file) {
        let _model = require(file);
        models[_model.modelName] = _model
    });


module.exports = models