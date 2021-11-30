const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
// const upload = require("../middleware/fileUpload");
const User = require("../models/User");
const controller = require("../Controller/users");
const { tokenVerifier } = require("../middleware/auth");
const { upload } = require("../middleware/avatarUpload");

// @route    POST api/users
// @desc     Register user
// @access   Public

// post a new user
// router.post("/", controller.postNewUser);
// user find by DBs ID
// router.get("/:id", controller.userById);

// update user data

// router.put("/address/:address", controller.updateUserInfo);



module.exports = router;
