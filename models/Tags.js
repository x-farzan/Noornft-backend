const mongoose = require('mongoose');
const Image = require('./Image');

const Schema = mongoose.Schema;
const tagSchema = new Schema({
    imageTag: {
        images: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
          },
         tag  :[ String ]
         
        }

        });

const Tags = mongoose.model('Tags', tagSchema);

module.exports = Tags;