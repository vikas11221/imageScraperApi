const moment = require("moment");
const Jimp = require("jimp");

// import helpers
const { scraperHelper, grayScaleHelper, removeDir } = require("../helpers");

// import collections
const { Images } = require("../models")

// initialize scraper
scraper = new scraperHelper({
  num: 15,
  detail: true,
  nightmare: {
    show: false
  }
})


module.exports = async (req, res, next) => {

  try {

    // Remove prev images if already searched
    let result = await Images.findOneAndUpdate(
      { keyword: req.params.keyword, isDelete: false },
      { $set: { isDelete: true } },
      { new: true })

    // Search and get full size images urls(not thumbnail images)
    let images_results = await scraper.search(req.params.keyword)

    // Save images into folder. Get urls and saved images path.
    let folderName = moment().format('x')
    new_result = await grayScaleHelper(images_results, folderName)

    if (result) {
      // delete the temp dir
      removeDir(`./public/images/${result.folderName}`)
    }

    // Save urls to database
    let docs = await Images.create({
      "keyword": req.params.keyword,
      "urls": new_result,
      "folderName": folderName
    })

    res.json(docs)
  }
  catch (error) {
    next(error)
  }

}