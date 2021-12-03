const express = require("express");
const { findOneAndUpdate } = require("../models/User");
const app = express();
require("dotenv").config();
const User = require("../models/User");

getRequests = async (req, res) => {
  // if (req.userData.role == "admin") {
  await User.find()
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.json({
          msg: "User not found.",
          data: [],
        });
      }
      const getUser = [];
      user.forEach((element) => {
        if (element.role == "artist" && element.reqStatus !== "approved") {
          getUser.push(element);
        }
      });
      return res.json({
        getUser,
      });
    })
    .catch((err) => {
      return res.json({
        msg: "vasdvasvqas",
      });
    });
  // } else {
  //   return res.json({
  //     msg: "You are not allowed to access this route.",
  //   });
  // }
};

respondRequest = async (req, res) => {
  id = req.params.id;
  reqStatus = req.body.status;
  //   console.log(reqStatus);
  if (req.userData.role == "admin") {
    await User.findOne({ _id: id })
      .exec()
      .then((user) => {
        if (user.reqStatus == "approved" || user.reqStatus == "rejected") {
          return res.json({
            msg: "You have already approved the request.",
          });
        }
        if (reqStatus == "approved") {
          user.reqStatus = "approved";
        } else if (reqStatus == "rejected") {
          user.reqStatus = "rejected";
        } else {
          return res.json({
            msg: "Entered status is not valid.",
          });
        }
        user.save();
        return res.json({
          msg: "You approved the request.",
        });
      })
      .catch((err) => {
        return res.json({
          msg: "User with this id doesn't exist.",
        });
      });
  } else {
    return res.json({
      msg: "You are not allowed to access the route.",
    });
  }
};

module.exports = {
  getRequests,
  respondRequest,
};
