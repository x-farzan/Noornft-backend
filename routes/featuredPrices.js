const express = require("express");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const router = express.Router();
const controller = require("../Controller/featuredPrices");

router.post("/add", tokenVerifier, controller.addFeaturedprices);
