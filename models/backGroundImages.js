const mongoose = require('mongoose');
const User = require('./User');

const Schema = mongoose.Schema;
const backgroundImage = new Schema({
    image1 :  {
        type : String,
        // required : true,
    } ,
    image2 :  {
        type : String,
        // required : true,
    } ,
    image3 :  {
        type : String,
        // required : true,
    } ,
    name :  {
        type : String,
        // required : true,
    } ,
  
    
});

const Image = mongoose.model('backgroundImage', backgroundImage);

module.exports = Image;