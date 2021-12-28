const express = require("express");
const { isAuthorized } = require("../middleware/isAuthorized");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const router = express.Router();
const controller = require("../Controller/nft");
const { upload } = require("../middleware/avatarUpload");

router
  .route("/create/:collectionId")
  .post(
    upload.single("imageUpload"),
    tokenVerifier,
    isAuthorized,
    controller.createNft
  );

router
  .route("/myowned")
  .get(tokenVerifier, isAuthorized, controller.myOwnedNfts);

module.exports = router;
