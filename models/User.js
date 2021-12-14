const mongoose = require("mongoose");
const image = require("./Image");

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },

    flname: {
      type: String,
    },

    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: false,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      unique: true,
    },

    location: {
      type: String,
      // required: true,
      // unique: true
    },

    city: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      // required: true,
      // unique: true
    },

    website: {
      type: String,
      // required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    projectId: {
      type: Number,
      default: null,
    },

    image: {
      type: String,
    },

    role: {
      type: String,
      enum: ["collector", "artist", "admin"],
      default: "artist",
    },

    reqStatus: {
      type: String,
      enum: ["rejected", "approved"],
    },

    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("user", UserSchema);
