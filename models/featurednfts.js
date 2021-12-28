const mongoose = require("mongoose");
// const image = require("./Image");

const featuredNftSchema = new mongoose.Schema(
  {
    nftId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reqStatus: {
      type: String,
      enum: ["rejected", "pending", "approved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("featurednfts", featuredNftSchema);
