const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");
const User = require("../models/User");
const { paginator } = require("../helpers/arrayPaginator");
require("dotenv").config();

exports.createNft = async (req, res) => {
  try {
    let _errors = userFieldsValidator(
      ["title", "description", "collectionName", "category"],
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
      collectionName: req.body.collectionName,
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
      title: req.body.title,
      collectionId: checkCollection._id,
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
          title: req.body.title,
          description: req.body.description,
          gatewayLink: `${process.env.server}/${req.file.path}`,
          externalLink: req.body.externalLink,
          collectionId: checkCollection._id,
          category: req.body.category,
          artistId: req.userData.id,
        });
        await newNft.save();

        return res.json({
          success: true,
          message: `NFT created successfully`,
        });
      }
    }
  } catch (error) {
    return res.json({
      error,
    });
  }
};

exports.myOwnedNfts = async (req, res) => {
  try {
    let paginated;
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        let finalObj = [];
        const getNfts = await nft.find({
          artistId: req.userData.id,
          listing: false,
          featured: false,
        });
        console.log(getNfts);
        if (getNfts.length < 1) {
          return res.json({
            success: false,
            message: `No NFT's to show.`,
          });
        }
        const getUserData = await User.findOne({ _id: req.userData.id });
        if (!getUserData) {
          return res.json({
            success: false,
            message: `No user found.`,
          });
        }
        console.log(`getUserData`, getUserData);
        for (let j = 0; j < getNfts.length; j++) {
          const getCollectionData = await collection.findOne({
            _id: getNfts[j].collectionId,
          });
          if (!getCollectionData) {
            return res.json({
              success: false,
              message: `No collections to show.`,
            });
          }
          getNfts[j] = {
            ...getNfts[j]._doc,
            collectionName: getCollectionData.collectionName,
            artistName: getUserData.username,
          };
          // getNfts[j].collectionName = getCollectionData.collectionName;
          // getNfts[j].artistName = getUserData.flname;
          console.log(getNfts[j]);
          finalObj.push(getNfts[j]);
        }
        if (finalObj.length < 1) {
          return res.json({
            success: false,
            data: [],
          });
        }
        paginated = paginator(finalObj, 12, req.query.page);
        return res.json({
          success: true,
          paginated,
        });
      }
    }
    // console.log(req.perm);
    // const getCollections = await collection.find({ artist: req.userData.id });
    // if (getCollections.length < 1) {
    //   return res.json({
    //     success: false,
    //     message: `You haven't created any collection yet!`,
    //   });
    // }
    // for (let i = 0; i < getCollections.length; i++) {
    //   const getNfts = await nft.find({
    //     collectionId: getCollections[i]._id,
    //     listing: false,
    //   });
    //   if (getNfts.length < 1) {
    //     return res.json({
    //       success: false,
    //       message: `No nfts available to show.`,
    //     });
    //   }
    //   return res.json({
    //     success: true,
    //     getNfts,
    //   });
    // }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

exports.nftDetail = async (req, res) => {
  try {
    const is_available = await nft.findOne({
      _id: req.params.nftId,
      listing: true,
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
