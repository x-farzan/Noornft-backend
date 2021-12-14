const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const controller = require("../Controller/auth");
const { upload } = require("../middleware/avatarUpload");

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
// router.get('/', controller.getAllUsers)
// router.post('/', controller.checkUser)

/* Farzan */
router.post("/signup", upload.single('image') , controller.signup);
router.post("/signin", controller.signin);
/* Farzan */

module.exports = router;
