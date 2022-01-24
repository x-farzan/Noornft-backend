const { paginator } = require("../helpers/arrayPaginator");
const collections = require("../models/collections");
const nft = require("../models/nft");
const User = require("../models/User");

exports.generalSearching = async (req, res) => {
  try {
    console.time("General Searching");
    let paginated;
    let _obj = [];
    console.log(`query : `, req.query.value);
    const query = req.query.value;

    const getNft = await nft
      .find({
        title: { $regex: query, $options: "i" },
        listing: true,
      })
      .populate([
        {
          path: "artistId",
          model: "user",
          select: "username",
        },
        {
          path: "collectionId",
          model: "collection",
          select: "collectionName",
        },
      ]);
    for (let i = 0; i < getNft.length; i++) {
      _obj.push(getNft[i]);
    }

    const getArtists = await User.find({
      username: { $regex: query, $options: "i" },
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

    if (_obj.length < 1) {
      return res.json({
        success: false,
        message: `Nothing to show.`,
      });
    }

    paginated = paginator(_obj, 12, req.query.page);
    console.timeEnd("General Searching");

    return res.json({
      success: true,
      paginated,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
