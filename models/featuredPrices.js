const mongoose = require("mongoose");

const featuredPriceSchema = new mongoose.Schema(
  {
    primaryBanner: {
      type: Boolean,
    },

    secondaryBanner: {
      type: Boolean,
    },

    primaryBannerValue: {
      type: Number,
    },

    secondaryBannerValue: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("featuredPrice", featuredPriceSchema);
