const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const Bids = require('../models/Bids');
 

postBid =   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { price , address, tokenId} = req.body;

    try {

      bid = new Bids({
        price,
        address,
        tokenId
      });

      await bid.save();
      res.status(200).send({
          bid,
          msg : "bid is submitted"
      })


    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  getBid = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let bid = await Bids.find({tokenId : req.params.id}).sort('price')
      
      if(bid.length <1) 
      return res
      .status(400)
      .json({  msg: 'Invalid tokenId' });

     return  res.status(200).send(bid)
    } 
    catch (error) {
      res.status(500).send(' server error');
      
    }
  
  }
  bidByAddress = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        let bid = await Bids.find({address : req.params.address})
        
        if(bid.length < 1) 
        return res.status(400).send("there is no bid against this address")
        console.log(bid)
        
      return res.status(200).send(bid)
    } 
    catch (error) {
      res.status(401).send(' server error');
      
    }
  
  }

  deleteBidByTokenId = async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        
        let bid = await Bids.deleteMany({tokenId : req.params.id})
        if(!bid) 
        return res.status(400).send("there is no bid against this token")
        res.status(200).send({
            msg : "bid against token ID is deleted"
        })
    }     catch (error) {
        res.status(500).send(' server error');
    }
}

  module.exports = { postBid, getBid, bidByAddress, deleteBidByTokenId};