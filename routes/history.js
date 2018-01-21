var router = require('express').Router();
const { historyController } = require("../controllers/")

/* GET (history) listing. */
router.get('/', historyController.getSearchHistory);

module.exports = router;
