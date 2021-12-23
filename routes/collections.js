const express = require("express");
const router = express.Router();
const controller = require("../Controller/collections");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const { isAuthorized } = require("../middleware/isAuthorized");

router.post("/create", tokenVerifier, isAuthorized, controller.createCollection);
router.get(
  "/getcollections",
  tokenVerifier,
  isAuthorized,
  controller.getCollections
);

module.exports = router;
