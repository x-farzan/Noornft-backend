const mongoose = require('mongoose');
const User = require('../models/User');

const Schema = mongoose.Schema;
const BidSchema = new Schema({
    price :  {
        type : String,
        required : true,
    } ,
    address: {
        type: String,
        required: true,
      },
    tokenId :{
         type : Number,
         required : true,
         Unique : true
    },
    
});

const Bids = mongoose.model('Bids', BidSchema);

module.exports = Bids;