const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const Image = require("../models/Image");
const User = require("../models/User");

// search
const searchBar = async (req, res) => {
  const { imagename, artistname } = req.body;

  try {
    let searchUser = await User.find({
      name: { $regex: req.body.search.toLowerCase().split(" ").join("-") },
    });

    let searchImage = await Image.find({
      name: { $regex: req.body.search.toLowerCase().split(" ").join("-") },
    });

    if (!searchImage && !searchUser) {
      return res.status(400).send({
        msg: "no search against this keyword",
      });
    } else {
      // let image = await Image.findOne({ name : {$regex : req.body.imagename}});
      // if (!image){
      return res
        .status(200)
        .send({ userSearch: searchUser, imageSearch: searchImage });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
module.exports = { searchBar };
