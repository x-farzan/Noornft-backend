const express = require("express");
const { isAuthorized } = require("../middleware/isAuthorized");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const router = express.Router();
const controller = require("../Controller/featurednfts");

router.post(
  "/nfts/:nftId",
  tokenVerifier,
  isAuthorized,
  controller.featuredNfts
);

router.get("/getnfts", tokenVerifier, isAuthorized, controller.getFeaturedNfts);

module.exports = router;
