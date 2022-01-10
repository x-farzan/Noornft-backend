const express = require("express");
const { findOneAndUpdate } = require("../models/User");
const app = express();
require("dotenv").config();
const User = require("../models/User");
var MongoClient = require("mongodb").MongoClient;
const { deleteRecord } = require("../helpers/deleteRecord");

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
        if (element.role == "artist" && !element.reqStatus) {
          getUser.push(element);
        }
      });
      return res.json(getUser);
    })
    .catch((err) => {
      return res.json({
        msg: "Something went wrong.",
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
  // if (req.userData.role == "admin") {
  await User.findOne({ _id: id })
    .exec()
    .then((user) => {
      // if (user.reqStatus == "approved" || user.reqStatus == "rejected") {
      //   return res.json({
      //     msg: "You have already responded to the request.",
      //   });
      // }
      if (reqStatus == "approved") {
        user.reqStatus = "approved";
        user.save();
      } else if (reqStatus == "rejected") {
        user.reqStatus = "rejected";
        const result = User.deleteOne({ _id: id })
          .then((result) => {
            console.log("RESULT ===========>>> ", result);
            if (result) {
              console.log("Successfully deleted.");
              return result;
            } else {
              console.log("Failed to delete.");
              return result;
            }
          })
          .catch((err) => {
            console.log("Error : ", err);
          });
        res.send({
          msg: "User deleted successfully.",
        });
      } else {
        return res.json({
          msg: "Entered status is not valid.",
        });
      }
      return res.json({
        msg: `You have ${reqStatus} the request.`,
      });
    })
    .catch((err) => {
      return res.json({
        msg: "User with this id doesn't exist.",
      });
    });
  // } else {
  //   return res.json({
  //     msg: "You are not allowed to access the route.",
  //   });
  // }
};

module.exports = {
  getRequests,
  respondRequest,
};
