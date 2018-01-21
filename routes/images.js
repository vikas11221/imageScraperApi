var router = require('express').Router();

// import required controllers
const { imagesController } = require("../controllers/")

/* GET images(from db) listing. */
router.get('/:keyword', imagesController.getImagesByKeyword);

module.exports = router;
