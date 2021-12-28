const mongoose = require("mongoose");
// const image = require("./Image");

const nftSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    gatewayLink: { type: String, required: true },

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

    listing: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("nft", nftSchema);
