const upload = require("../middleware/fileUpload");
const Image = require("../models/Image");
const Tags = require("../models/Tags");
require("dotenv").config();

const URL = `${process.env.HOST}/files/`;
// const URL = "http://localhost:5000/files/";

const fs = require("fs");

// upload a file
const uploadFile = async (req, res) => {
  try {
    await upload(req, res);
    if (req.file == undefined) {
      console.log("file----", req.file);
      return res.status(400).send({ message: "Choose a file to upload" });
    }
    const id = await req.body.tokenId;

    console.log(typeof req.body.tag);
    let refinedTags =
      typeof req.body.tag === "string"
        ? JSON.parse(req.body.tag)
        : req.body.tag;

    // console.log("mime type---------", req.file.mimetype.toLowerCase().split('/').join(','))

    // console.log('file----', req.file)
    const image = new Image({
      image:
        `${process.env.HOST}/uploads/` +
        req.file.originalname.toLowerCase().split(" ").join("-"),
      Imagename: req.file.originalname.toLowerCase().split(" ").join("-"),
      name: req.body.name.toLowerCase().split(" ").join("-"),
      tokenId: id,
      Owner: req.body.owner,
      Artist: req.body.artist,
      tag: refinedTags,
      Avatar: req.body.Avatar,
      extension: req.file.mimetype.toLowerCase().split("/").join(" , "),
    }).populate("user");

    console.log("length----", image);

    let images = await Image.find().populate("user").select("name");
    console.log(images);
    console.log(req.body.user);
    await image.save();

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 500MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
// get all uploaded files
const getFilesList = async (req, res) => {
  const path = __basedir + "/public/uploads/";

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    const fileName = files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + file,
      });
      // console.log(filesList.name)
    });
  });
  const image = await Image.find().sort("name");
  // console.log(filesList[0].name)

  res.status(200).send(image);
};
// download a single file
const downloadFiles = (req, res) => {
  const fileName = req.params.name;
  const path = __basedir + "/public/uploads/";

  res.download(path + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

// get image by id

const getImageById = async (req, res) => {
  try {
    var image = await Image.find({ tokenId: req.params.tokenId });
    if (image.length < 1)
      return res.status(400).send("the image with given tokenId is not found");
    return res.status(200).send(image);
  } catch (error) {
    res.status(500).send({
      msg: "server error",
    });
  }
};

// change the owner ship
const changeOwner = async (req, res) => {
  try {
    var image = await Image.findOneAndUpdate(
      { tokenId: req.params.id },
      { Owner: req.body.owner },
      { new: true }
    );
    if (!image) return res.status(400).send("enter a valid id of tokenId");

    res.status(200).send(image);
  } catch (error) {
    res.status(500).send({
      msg: "server error",
    });
  }
};

// delete an image from backend
const deleteImage = async (req, res) => {
  try {
    var image = await Image.findOneAndDelete({ tokenId: req.params.tokenId });
    if (!image) return res.status(400).send("enter a valid id");
    res.status(200).send({
      msg: "image deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      msg: "server error",
    });
  }
};

// add tags to an image not functional

const addTag = async (req, res) => {
  try {
    const body = { imageTag: { images: req.body.image, tag: req.body.tag } };
    const tag = new Tags(body);
    console.log(body);
    // const tags = await Tags.find()
    await tag.save();

    // let tag =  await Tags.findOne({"imageTag.images": "60c7892b1963f91188080b30"})

    //   console.log("nothing------", tag.imageTag.tag.push('asd'))

    res.status(200).send(tag);
  } catch (error) {
    res.status(500).send({
      msg: "server error",
    });
  }
};

module.exports = {
  uploadFile,
  downloadFiles,
  getFilesList,
  changeOwner,
  deleteImage,
  getImageById,
  addTag,
};
