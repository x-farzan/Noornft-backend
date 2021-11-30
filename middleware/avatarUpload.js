const util = require("util");
const multer = require("multer");

const DIR = "./public/uploads/";
const Image = require("../models/Image");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(req.body.tokenId )
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    // const image = new Image({ filePath : DIR+fileName,
    //     //  tokenId : req.body.tokenId
    //     })
    // console.log(req.body.tokenId )
    cb(null, fileName);
    //  image.save();
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/Jpeg" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/mov" ||
      file.mimetype === "video/webm" ||
      file.mimetype === "video/wmv" ||
      file.mimetype === "video/avi" ||
      file.mimetype === "video/mkv" ||
      file.mimetype === "video/gifv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          "File types allowed .jpeg, .jpg, .wmv, .mov, .mkv, .gifv and .png!"
        )
      );
    }
  },
}).single("file");

// let fileUploadMiddleware = util.promisify(upload);

module.exports = { upload };
