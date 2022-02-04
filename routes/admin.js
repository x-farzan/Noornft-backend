const express = require("express");
const {
  getRequests,
  respondRequest,
  primaryWalletRequests,
  respondPrimaryWalletRequests,
} = require("../Controller/admin");
const app = express();
const router = express.Router();
const User = require("../models/User");
const controller = require("../Controller/admin");
const { tokenVerifier } = require("../middleware/tokenVerifier");

router.get("/get/requests", getRequests);
router.post("/respond/request/:id", respondRequest);
router.get("/requests/primary", primaryWalletRequests);
router.post("/respond/primary/:userId", respondPrimaryWalletRequests);

module.exports = router;
