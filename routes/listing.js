const express = require("express");
const router = express.Router();
const controller = require("../Controller/listing");
const { isAuthorized } = require("../middleware/isAuthorized");
const { tokenVerifier } = require("../middleware/tokenVerifier");

router.post("/:nftId", tokenVerifier, isAuthorized, controller.makeListed);

router.get("/getlisted", tokenVerifier, isAuthorized, controller.myListingNfts);

router.put(
  "/remove/:nftId",
  tokenVerifier,
  isAuthorized,
  controller.removeNftFromListing
);

router.get('/marketplace', tokenVerifier, controller.marketplaceListing)

module.exports = router;
