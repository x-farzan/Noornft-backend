const express = require("express");
const User = require("../models/User");
const { respondRequest } = require("./admin");
require("dotenv").config();

getProfile = async (_id) => {
  await User.find({ _id: _id })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.send(`User with this id doen't exists.`);
      }
      console.log("USER C : ===============================>>>>", user[0]);
      return res.send(user);
    })
    .catch((err) => {
      return res.send("Something went wrong.");
    });
};

module.exports = { getProfile };
