const collections = require("../models/collections");
const nft = require("../models/nft");
const User = require("../models/User");

exports.generalSearching = async (req, res) => {
  try {
    let _obj = [];
    const query = req.query.value;

    const getNft = await nft.find({
      title: { $regex: query },
      listing: true,
    });
    for (let i = 0; i < getNft.length; i++) {
      _obj.push(getNft[i]);
    }

    const getArtists = await User.find({
      username: { $regex: query },
      role: "artist",
    });
    for (let i = 0; i < getArtists.length; i++) {
      _obj.push(getArtists[i]);
    }

    const getCollections = await collections.find({
      collectionName: req.body.value,
    });
    for (let i = 0; i < getCollections; i++) {
      _obj.push(getCollections[i]);
    }

    return res.json({
      _obj,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
