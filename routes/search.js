var router = require('express').Router();
const { scraperController } = require("../controllers/")

/* GET new(search) images listing. */
router.get('/:keyword', scraperController);

module.exports = router;
