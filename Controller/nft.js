const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");
const User = require("../models/User");
const { paginator } = require("../helpers/arrayPaginator");
require("dotenv").config();

exports.createNft = async (req, res) => {
  try {
    let _errors = userFieldsValidator(
      ["Title", "Description", "CollectionName", "Category"],
      // "Royalty"],
      req.body
    );

    if (_errors.length > 0) {
      return res.send(_errors);
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: `Please upload a file.`,
      });
    }

    // checking collection, if available.
    const checkCollection = await collection.findOne({
      collectionName: req.body.CollectionName,
      artist: req.userData.id,
    });
    if (checkCollection < 1) {
      return res.json({
        success: false,
        message: `Collection with this name doesn't exists.`,
        data: [],
      });
    }

    // checking nft, if exists before.
    const checkNft = await nft.findOne({
      title: req.body.Title,
      // collectionId: checkCollection._id,
    });
    if (checkNft) {
      return res.json({
        success: false,
        message: `NFT with this name is already available in this collection. Try another name!`,
      });
    }

    //creating NFT.
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        const newNft = new nft({
          nftId: req.body.nftId,
          title: req.body.Title,
          description: req.body.Description,
          gatewayLink: `${process.env.server}/${req.file.path}`,
          externalLink: req.body.ExternalLink,
          collectionId: checkCollection._id,
          category: req.body.Category,
          artistId: req.userData.id,
          royalty: req.body.Royalty,
        });
        await newNft.save();

        return res.json({
          success: true,
          message: `NFT created successfully`,
          data: newNft.gatewayLink,
        });
      }
    }
  } catch (error) {
    return res.json({
      error,
    });
  }
};

exports.deleteNft = async (req, res) => {
  try {
    const nftId = req.params.nftId;
    console.log(nftId);
    const _nft = await nft.findOne({ _id: nftId });
    if (!_nft) {
      return res.json({
        success: false,
        message: `NFT with this _id not exists.`,
        data: [],
      });
    }
    await nft.deleteOne({ _id: nftId });
    return res.json({
      success: true,
      message: "NFT deleted successfully.",
      data: _nft,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.myOwnedNfts = async (req, res) => {
  try {
    console.time("my owned");
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        let finalObj = [];
        const getNfts = await nft
          .find({
            artistId: req.userData.id,
            listing: false,
            featured: false,
          })
          .limit(12 * req.query.page)
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
          ])
          .sort({ createdAt: -1 });
        console.log(getNfts);
        if (getNfts.length < 1) {
          return res.json({
            success: false,
            message: `No NFT's to show.`,
          });
        }
        console.timeEnd("my owned");

        return res.json({
          success: true,
          paginated: getNfts,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

exports.nftDetail = async (req, res) => {
  try {
    const is_available = await nft
      .findOne({
        _id: req.params.nftId,
        listing: true,
      })
      .populate({
        path: "artistId",
        model: "user",
        select: "projectId",
      });
    if (!is_available) {
      return res.json({
        success: false,
        message: `Details related to this nft not found.`,
      });
    }
    return res.json({
      success: true,
      is_available,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.searchNft = async (req, res) => {
  try {
    console.time("searchNFT");
    let finalObj = [];
    if (!req.query.value) {
      return res.json({
        success: false,
        message: `Type in to search something.`,
      });
    }

    const query = req.query.value;
    const is_available = await nft
      .find({
        title: { $regex: query, $options: "i" },
      })
      .limit(12 * req.query.page)
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
    if (is_available.length < 1) {
      return res.json({
        success: false,
        message: `No nft's found with this name.`,
        paginated: [],
      });
    }
    console.timeEnd("searchNFT");
    return res.json({
      success: true,
      paginated: is_available,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.getLink = (req, res) => {
  if (!req.file) {
    res.json({
      success: false,
      message: "Please upload a file.",
      data: [],
    });
  }

  return res.json({
    success: true,
    imageUrl: `${process.env.server}/${req.file.path}`,
  });
};
