const mongoose = require("mongoose");
// const image = require("./Image");

const UserSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    externalLink: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("nft", UserSchema);
