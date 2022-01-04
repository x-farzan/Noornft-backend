const mongoose = require("mongoose");

const featuredPriceSchema = new mongoose.Schema(
  {
    mainBanner: {
      type: Boolean,
    },

    secondarySlider: {
      type: Boolean,
    },

    mainBannerPrice: {
      type: Number,
    },

    secondarySliderPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("featuredPrice", featuredPriceSchema);
