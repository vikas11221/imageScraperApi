// import collections
const { Images } = require("../models")

var _images = {}

_images.getImagesByKeyword = async (req, res, next) => {
    // find each person with a last name matching 'Ghost'
    var query = Images.find({ 'keyword': req.params.keyword, "isDelete": false });

    // execute the query at a later time
    query.exec(function (err, data) {
        if (err) return next(err);
        res.json(data)
    })

}

module.exports = _images