const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const Bids = require('../models/Bids');
const controller = require("../Controller/bids");

// paste a new bid


router.post(
    '/post',  controller.postBid);

// get a single bid
router.get ('/:id', controller.getBid);

  // bid against an address
  router.get ('/get/:address', controller.bidByAddress);

  // delete a bid
  router.delete ("/delete/:id", controller.deleteBidByTokenId)
  

  module.exports = router;