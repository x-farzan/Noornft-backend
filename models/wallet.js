const mongoose = require("mongoose");
const image = require("./Image");

const walletSchema = new mongoose.Schema(
  {
    addresses: [{ type: String }],
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("wallet", walletSchema);
