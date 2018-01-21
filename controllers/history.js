// import collections
const { Images } = require("../models")

var _history = {}

_history.getSearchHistory = async (req, res, next) => {
    // find images keyword
    var query = Images.find({ "isDelete": false }, "keyword");

    // execute the query at a later time
    query.exec(function (err, data) {
        if (err) return next(err);
        res.json(data)
    })

}

module.exports = _history