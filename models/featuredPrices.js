const mongoose = require("mongoose");

const featuredPriceSchema = new mongoose.Schema(
  {
    primaryBanner: {
      type: Number,
    },

    secondaryBanner: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("featuredPrice", featuredPriceSchema);
