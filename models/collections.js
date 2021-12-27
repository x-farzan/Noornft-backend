const mongoose = require("mongoose");
const image = require("./Image");

const collectionSchema = new mongoose.Schema(
  {
    collectionName: {
      type: String,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("collection", collectionSchema);
