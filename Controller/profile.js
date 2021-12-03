const express = require("express");
const User = require("../models/User");
const { respondRequest } = require("./admin");
require("dotenv").config();

getProfile = async (_id) => {
  await User.find({ _id: _id })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return JSON.stringify(`User with this id doen't exists.`);
      }
      console.log("USER C : ===============================>>>>", user[0]);
      return user[0];
    })
    .catch((err) => {
      return JSON.stringify("Something went wrong.");
    });
};

module.exports = { getProfile };
