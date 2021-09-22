
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');




getAllUsers = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.find().sort('name')
      // console.log(user)
      res.send(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  // @route    POST api/auth
  // @desc     Authenticate user & get token
  // @access   Public

    // check('email', 'Please include a valid email').isEmail(),
   checkUser = async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { address } = req.body;
  
      try {
        let user = await User.findOne({ address });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
    
        res.send(user)
  
     
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  ;
  module.exports = { getAllUsers, checkUser};