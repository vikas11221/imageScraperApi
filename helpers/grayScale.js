const Jimp = require("jimp");
const moment = require("moment")

/**
 * Compress and convert images to gray scale. download one by one because.
 * Socket hangup error will occur if more download request sent parallelly 
 * 
 * @param {Array} imagesUrls - array of images object should contain url in every object
 * @param {String} folderName - name of the folder in which files will be saved
 * @returns {Array} filelist - Array of promises(containing local path to converted images)
*/
module.exports = (imagesUrls, folderName) => {

    return new Promise((resolve, reject) => {
        var index = 0;
        fetch(imagesUrls[0], index)
        async function fetch(item, index) {
            try {
                if (imagesUrls.length == index)
                    return resolve(imagesUrls)

                // fetch image from url
                let image = await Jimp.read(item.url)

                // get the mimetype
                let _mimeType = item.type.split("/")[1]

                // should be jpg or png
                if (_mimeType !== "jpg" && _mimeType !== "png")
                    _mimeType = "jpg"

                //save to temp folder 
                let greyscalePath = `./public/images/${folderName}/${moment().format('x')}.${_mimeType}`

                if (image) {
                    image.quality(60).greyscale().write(greyscalePath);
                }

                item["processed_image_url"] = greyscalePath.replace("./public","")
                index += 1
                
                fetch(imagesUrls[index], index)
                
            } catch (error) {
                item["processed_image_url"] = "invalid"
                index += 1
                fetch(imagesUrls[index], index)
            }
        }
    })

    return results
}