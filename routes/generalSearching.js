const express = require("express");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const router = express.Router();
const controller = require("../Controller/generalSearching");

router.get("/", tokenVerifier, controller.generalSearching);

module.exports = router;
