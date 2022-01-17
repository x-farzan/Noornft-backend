const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Image = require('../models/Image')

const controller = require("../Controller/searchBar")

// search by by single or multiple alphabets

router.post('/bar', 

controller.searchBar
);
  

  module.exports = router;
