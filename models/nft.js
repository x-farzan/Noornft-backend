const mongoose = require("mongoose");
// const image = require("./Image");

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
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
