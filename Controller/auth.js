const express = require("express");
const router = express.Router();
const bCrypt = require("bcryptjs");
const auth = require("../middleware/tokenVerifier");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const userFieldsValidator = require("../helpers/userFieldsValidator");
const validator = require("validator");
const User = require("../models/User");
const { sendMail } = require("../helpers/nodemailer");
const { linkGenerator } = require("../helpers/signupConfirmationLink");

/* Farzan */

signup = async (req, res) => {
  let _errors = userFieldsValidator.userFieldsValidator(
    ["flname", "email", "password", "username"],
    req.body
  );
  if (_errors.length > 0) {
    res.send(_errors);
  }

  let to_lowercase = req.body.email;
  to_lowercase = to_lowercase.toLowerCase();

  //checking for the email, if already exists!!
  if (validator.isEmail(to_lowercase)) {
    await User.find({
      $or: [{ email: to_lowercase }, { username: req.body.username }],
    })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Email/Username already exists!",
          });
        } else {
          //
          bCrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
              res.status(500).json({
                message: "Password is required.",
              });
            } else {
              // Generating a random code
              const confirmationCode = linkGenerator();

              // creating a user
              const user = new User({
                flname: req.body.flname,
                email: to_lowercase,
                password: hash,
                role: req.body.role,
                username: req.body.username,
                confirmationCode: confirmationCode,
              });
              console.log(`displaying user : `, user);
              await user
                .save()
                .then((result) => {
                  sendMail(to_lowercase, req.body.flname, confirmationCode);
                  return res.status(201).json({
                    message:
                      "User created successfully. Please verify the link sent in the provided email",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err.message,
                  });
                });
            }
          });
          //
        }
      })
      .catch((err) => {
        res.json({
          error: err,
        });
      });
  } else {
    res.json({
      message: "Enter a valid email.",
    });
  }
};

userVerify = async (req, res) => {
  const code = req.params.confirmationCode;
  const user = await User.findOne({
    confirmationCode: code,
  });
  if (!user) {
    return res.json({
      success: false,
      message: "User not exists.",
    });
  }
  user.reqStatus = "approved";
  await user.save();
  return res.json({
    success: true,
    message: "User is now verified, Login to continue now.",
  });
};

signin = async (req, res) => {
  let _errors = userFieldsValidator.userFieldsValidator(
    ["email", "password"],
    req.body
  );
  if (_errors.length > 0) {
    res.send(_errors);
  }

  let to_lowercase = req.body.email;
  to_lowercase = to_lowercase.toLowerCase();
  // checking for email, if exists
  await User.find({ email: to_lowercase })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email not found.",
        });
      }

      if (user[0].reqStatus !== "approved") {
        return res.json({
          message: "Please verify the link sent in the provided email.",
        });
      }

      // comparing passwords and assigning token in user's db
      bCrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            {
              id: user[0]._id,
              username: user[0].username,
              flname: user[0].flname,
              email: user[0].email,
              address: user[0].address,
              role: user[0].role,
              reqStatus: user[0].reqStatus,
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
          );
          user[0].token = token;
          user[0].save();
          // req.token = token;
          return res.status(200).json({
            message: "Auth successfull",
            _id: user[0]._id,
            role: user[0].role,
            walletaddress: user[0].address,
            username: user[0].username,
            token: user[0].token,
            flname: user[0].flname,
            email: user[0].email,
            image: `${process.env.server}/${user[0].image}`,
            projectId: user[0].projectId,
            primaryAddress: user[0].primaryAddress,
          });
        } else {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
      });
    })
    .catch((err) => {
      console.log("ERROR", err);
      return res.status(500).json({
        error: err,
      });
    });
};

changePassword = async (req, res) => {
  try {
    const _errors = userFieldsValidator.userFieldsValidator(
      ["oldPassword", "newPassword", "confirmPassword"],
      req.body
    );
    if (_errors.length > 0) {
      return res.json({
        _errors,
      });
    }

    const get_user = await User.findOne({
      _id: req.userData.id,
    });
    if (!get_user) {
      return res.json({
        success: false,
        message: `Not a valid user.`,
      });
    }

    bCrypt.compare(req.body.oldPassword, get_user.password, (err, result) => {
      if (result) {
        if (req.body.newPassword != req.body.confirmPassword) {
          return res.json({
            success: false,
            message: `Make sure new and confirm passwords match.`,
          });
        }
        bCrypt.hash(req.body.newPassword, 10, async (err, hash) => {
          if (err) {
            return res.json({
              success: false,
              message: `Password update failed.`,
            });
          }
          get_user.password = hash;
          await get_user.save();
          return res.json({
            success: true,
            message: `Password updated successfully.`,
          });
        });
      } else {
        return res.json({
          success: false,
          message: `Your old password is not valid.`,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

/* Farzan */

module.exports = { signup, userVerify, signin, changePassword };
