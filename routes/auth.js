const express = require("express");
const router = express.Router();
const controller = require("../Controller/auth");
const {tokenVerifier} = require('../middleware/auth');

/* Farzan */
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
/* Farzan */

module.exports = router;
