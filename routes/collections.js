const express = require("express");
const router = express.Router();
const controller = require("../Controller/collections");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const { isAuthorized } = require("../middleware/isAuthorized");

router.post(
  "/create",
  tokenVerifier,
  isAuthorized,
  controller.createCollection
);
router.get("/view", tokenVerifier, isAuthorized, controller.getCollections);

router.delete(
  "/delete/:id",
  tokenVerifier,
  isAuthorized,
  controller.deleteCollection
);

router.get("/searchcollection", tokenVerifier, controller.searchCollection);

router.get("/allcollections", controller.allCollections);

module.exports = router;
