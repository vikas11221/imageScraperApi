var router = require('express').Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',
    { title: 'Home' }
  )
});

// search
router.use("/search", require("./search"))

// get images
router.use("/images", require("./images"))

// Search history
router.use('/history', require("./history"));

module.exports = router;
