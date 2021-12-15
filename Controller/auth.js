const express = require("express");
const router = express.Router();
const bCrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const userFieldsValidator = require("../helpers/userFieldsValidator");
const validator = require("validator");
const User = require("../models/User");

getAllUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.find().sort("name");
    // console.log(user)
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

// check('email', 'Please include a valid email').isEmail(),
checkUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.body;

  try {
    let user = await User.findOne({ address });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/* Farzan */
signup = async (req, res) => {
  const imageName = req.file;
  let _errors = userFieldsValidator.userFieldsValidator(
    [
      "flname",
      "email",
      "password",
      "walletaddress",
      "city",
      "username",
      "description",
    ],
    req.body
  );
  if (_errors.length > 0) {
    res.send(_errors);
  }

  console.log(`REQ BODY : `, req.body);

  //checking for the email, if already exists!!
  if (validator.isEmail(req.body.email)) {
    console.log(`entered`);
    await User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Email already exists!",
          });
        } else {
          //
          User.find({ address: req.body.walletaddress })
            .exec()
            .then((user) => {
              if (user.length >= 1) {
                return res.status(409).json({
                  message: "Address already exists!",
                });
              } else {
                // Creating a user
                bCrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                    res.status(500).json({
                      message: "Password is required.",
                    });
                  } else {
                    console.log(`in else block`);
                    const user = new User({
                      //_id = new mongoose.Types.ObjectId(),
                      flname: req.body.flname,
                      email: req.body.email,
                      password: hash,
                      address: req.body.walletaddress,
                      role: req.body.role,
                      description: req.body.description,
                      city: req.body.city,
                      username: req.body.username,
                      // image: req.file,
                    });
                    console.log(`displaying user : `, user);
                    user
                      .save()
                      .then((result) => {
                        res.status(201).json({
                          message: "User created successfully",
                        });
                      })
                      .catch((err) => {
                        res.status(500).json({
                          error: err,
                        });
                      });
                  }
                });
              }
            })
            .catch((err) => {
              res.json({
                error: err,
              });
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

signin = async (req, res) => {
  let _errors = userFieldsValidator.userFieldsValidator(
    ["email", "password"],
    req.body
  );
  if (_errors.length > 0) {
    res.send(_errors);
  }
  // checking for email, if exists
  await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email not found.",
        });
      }

      if (user[0].reqStatus !== "approved") {
        return res.json({
          message:
            "Your request is currently under review. You can login after the reviewing process is completed.",
        });
      }

      // comparing passwords and assigning token in user's db
      bCrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (result) {
          // const token = jwt.sign(
          //   {
          //     id: user[0]._id,
          //     email: user[0].email,
          //     address: user[0].address,
          //     role: user[0].role,
          //     reqStatus: user[0].reqStatus,
          //   },
          //   process.env.JWT_KEY,
          //   { expiresIn: "24h" }
          // );
          // user[0].token = token;
          // user[0].save();
          //req.token = token;
          return res.status(200).json({
            message: "Auth successfull",
            _id: user[0]._id,
            role: user[0].role,
            walletaddress: user[0].address,
            projectId: user[0].projectId,
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
/* Farzan */

module.exports = { getAllUsers, checkUser, signup, signin };
