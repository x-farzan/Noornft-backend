const express = require("express");
const router = express.Router();
const controller = require("../Controller/auth");
const { tokenVerifier } = require("../middleware/tokenVerifier");

/* Farzan */
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.put("/changepassword", tokenVerifier, controller.changePassword);
/* Farzan */

module.exports = router;
