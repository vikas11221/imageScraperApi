var mongoose = require("mongoose");

var ImagesSchema = new mongoose.Schema({
    keyword: {
        type: String,
        index: true
    },
    urls: {
        type: mongoose.Schema.Types.Mixed,
    },
    folderName: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

var Images = mongoose.model('Images', ImagesSchema);

module.exports = Images