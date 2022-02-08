const mongoose = require("mongoose");
// const image = require("./Image");

const nftSchema = new mongoose.Schema(
  {
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },

    nftId: String,

    title: {
      type: String,
    },

    gatewayLink: { type: String },

    description: {
      type: String,
    },

    externalLink: {
      type: String,
    },

    category: {
      type: String,
    },

    listing: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    reqStatus: {
      type: String,
      enum: ["approved", "pending", "rejected", "null"],
      default: "null",
    },

    price: {
      type: Number,
      default: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    mainBannerPrice: {
      type: Number,
    },

    secondarySliderPrice: {
      type: Number,
    },

    royalty: {
      // In percentage
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("nft", nftSchema);
