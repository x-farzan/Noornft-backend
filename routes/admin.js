const express = require("express");
const { getRequests, respondRequest } = require("../Controller/admin");
const app = express();
const router = express.Router();
const User = require("../models/User");
const controller = require("../Controller/admin");
const { tokenVerifier } = require("../middleware/tokenVerifier");

router.get("/get/requests", getRequests);
router.post("/respond/request/:id", respondRequest);

module.exports = router;
