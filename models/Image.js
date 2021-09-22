const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    image :  {
        type : String,
        required : true,
    } ,
    Imagename: {
        type: String,
        required: true,
      },
    name: {
        type: String,
        required: true,
      },
      tag  :[ String ],
    tokenId :{
         type : Number,
         required : true,
         Unique : true
    },
    Owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required : true
    },
  Artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required : true
    },
    extension: {
      type: String,
      // required: true,
    },

    
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;