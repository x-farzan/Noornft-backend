const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const upload = require("../middleware/fileUpload");
const User = require("../models/User");
require("dotenv").config();
const userFieldsValidator = require("../helpers/userFieldsValidator");
const fs = require("fs");
const path = require("path");
var axios = require("axios");
const pinataSDK = require("@pinata/sdk");
const pinata = pinataSDK(process.env.pinatakey1, process.env.pinatakey2);

postNewUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await upload(req, res);
    // if (req.file == undefined) {
    //   console.log('file----', req.file)
    //   return res.status(400).send({ message: "Choose a file to upload" });
    // }

    let user = await User.findOne({ address: req.body.address });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      await upload(req, res);
    }

    user = new User({
      // avatar : "http://localhost:5000/uploads/"+req.file.originalname.toLowerCase().split(' ').join('-'),
      flname: "",
      name: req.body.name.toLowerCase().split(" ").join("-"),
      email: req.body.email,
      // password,
      address: req.body.address,
      role: req.body.role,
      location: "",
      bio: "",
      website: "",
      avatar: "",
    });

    await user.save();

    res.status(200).send({
      message: "profile is created",
      user,
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

userById = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.params.id });

    return res.status(200).send(user);
  } catch (error) {
    res.status(400).send("the user with given ID is not found");
  }
};

updateUserInfo = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      var user = await User.findOneAndUpdate(
        { address: req.params.address },
        {
          location: req.body.location,
          bio: req.body.bio,
          website: req.body.website,
          flname: req.body.flname.split(" ").join("-"),
        },
        { new: true }
      );
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User doesnt exist" }] });
      }
      res.status(200).send({
        message: "data is updated",
        user,
      });
    } else {
      var user = await User.findOneAndUpdate(
        { address: req.params.address },
        {
          avatar:
            `${process.env.HOST}/uploads/` +
            req.file.originalname.toLowerCase().split(" ").join("-"),

          // name : req.body.name.toLowerCase().split(' ').join('-'),
          // email : req.body.email,
          location: req.body.location,
          bio: req.body.bio,
          website: req.body.website,
          flname: req.body.flname.split(" ").join("-"),
        },

        { new: true }
      );
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User doesnt exist" }] });
      }
    }

    await user.save();

    res.status(200).send({
      message: "user is updated",
      user,
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

uploadnft = async (imageName) => {
  try {
    const isAuth = await pinata.testAuthentication();
    console.log(isAuth);
    console.log("yes");
    const readableStreamForFile = fs.createReadStream(
      path.join(__dirname, "../uploads", `${imageName}`)
    );
    console.log(readableStreamForFile.path);
    const result = await pinata.pinFileToIPFS(readableStreamForFile);
    console.log("file uploaded succesfully...", result);
    const filehash = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    console.log("done", filehash);
    return JSON.stringify(filehash);
  } catch (error) {}
};

uploadNftInfo = async (data) => {
  var config = {
    method: "post",
    url: "https://api-testnet.nft-maker.io/UploadNft/18896689bab346c8bf3e7080cbed3e10/5063",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios(config)
    .then(function (response) {
      console.log("second ==============>", response);
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
};

module.exports = {
  postNewUser,
  userById,
  updateUserInfo,
  uploadnft,
  uploadNftInfo,
};
