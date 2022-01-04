const mongoose = require("mongoose");

const featuredPriceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("featuredPrice", featuredPriceSchema);
