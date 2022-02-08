const express = require("express");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const router = express.Router();
const controller = require("../Controller/featuredPrices");
const { isAuthorized } = require("../middleware/isAuthorized");

router.post("/add", tokenVerifier, isAuthorized, controller.addFeaturedprices);

router.get("/view", tokenVerifier, controller.getFeaturedPrices);

router.put(
  "/update/:id",
  tokenVerifier,
  isAuthorized,
  controller.updateFeaturedPrices
);

router.delete(
  "/delete/:id",
  tokenVerifier,
  isAuthorized,
  controller.deleteFeaturedPrices
);

module.exports = router;
