const express = require("express");
const { findOneAndUpdate } = require("../models/User");
const app = express();
require("dotenv").config();
const User = require("../models/User");
var MongoClient = require("mongodb").MongoClient;
const { deleteRecord } = require("../helpers/deleteRecord");
const { userFieldsValidator } = require("../helpers/userFieldsValidator");

getRequests = async (req, res) => {
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
};

respondRequest = async (req, res) => {
  id = req.params.id;
  reqStatus = req.body.status;
  await User.findOne({ _id: id })
    .exec()
    .then((user) => {
      if (user.reqStatus == "approved" || user.reqStatus == "rejected") {
        return res.json({
          msg: "You have already responded to the request.",
        });
      }
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
};

primaryWalletRequests = async (req, res) => {
  try {
    const _user = await User.find({ primaryAddressStatus: "pending" });
    if (_user.length < 1) {
      return res.json({
        success: false,
        message:
          "None of the users have applied for the primary wallet request.",
        data: [],
      });
    }
    return res.json({
      success: true,
      data: _user,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

respondPrimaryWalletRequests = async (req, res) => {
  try {
    // const { userId } = req.params.userId;
    const _errors = userFieldsValidator(["status"], req.body);
    if (_errors.length > 1) {
      return res.json({
        _errors,
      });
    }
    // const { status } = req.body.status;

    // if (req.body.status !== "approved" || req.body.status !== "rejected") {
    //   return res.json({
    //     success: false,
    //     message: "The passed status is not valid.",
    //     data: [],
    //   });
    // }
    const _user = await User.findOne({ _id: req.params.userId });
    if (!_user) {
      return res.json({
        success: false,
        message: "User with this _is not exists!",
        data: [],
      });
    }
    if (req.body.status == "rejected") {
      _user.primaryAddress = "null";
      _user.primaryAddressStatus = req.body.status;
    } else {
      _user.primaryAddressStatus = req.body.status;
    }
    await _user.save();
    return res.json({
      success: true,
      message: `You have ${req.body.status} the primary wallet request of ${_user.username}`,
      data: [],
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

module.exports = {
  getRequests,
  respondRequest,
  primaryWalletRequests,
  respondPrimaryWalletRequests,
};
