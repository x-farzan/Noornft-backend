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

    address: [
      {
        type: String,
        // required: true,
        unique: true,
      },
    ],

    location: {
      type: String,
      // required: true,
      // unique: true
    },

    city: {
      type: String,
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

    followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],

    following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }

  // timestamps: true,
);

module.exports = mongoose.model("user", UserSchema);
