const nft = require("../models/nft");
const featuredNfts = require("../models/featurednfts");
const featurednfts = require("../models/featurednfts");
const User = require("../models/User");
const collection = require("../models/collections");
const { userFieldsValidator } = require("../helpers/userFieldsValidator");

exports.featuredNfts = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        // check NFT if exits.
        const checkNft = await nft.findOne({
          _id: req.params.nftId,
          listing: true,
        });
        if (checkNft < 1) {
          return res.json({
            message: false,
            messgae: `No NFT found`,
            data: [],
          });
        }
        if (checkNft.featured == true && checkNft.reqStatus == "pending") {
          return res.json({
            success: false,
            message: `NFT is already requested for approval.`,
            data: [],
          });
        } else if (
          checkNft.featured == true &&
          checkNft.reqStatus == "approved"
        ) {
          return res.json({
            success: false,
            message: `NFT is already approved and featured.`,
            data: [],
          });
        }

        (checkNft.featured = true),
          (checkNft.reqStatus = "pending"),
          checkNft.save();
        return res.json({
          success: true,
          message: `Your request to make "${checkNft.title}" has been requested to approve.`,
        });
      }
    }
  } catch (error) {
    return res.json({
      error,
    });
  }
};

exports.getFeaturedNfts = async (req, res) => {
  try {
    let finalObj = [];
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getFeatured = await nft.find({
          artistId: req.userData.id,
          featured: true,
          reqStatus: "approved",
        });
        if (getFeatured.length < 1) {
          return res.json({
            success: false,
            message: `No featured NFT's to show or NFT has not been approved by the admin.`,
            data: [],
          });
        }
        const getUserData = await User.findOne({ _id: req.userData.id });
        if (!getUserData) {
          return res.json({
            success: false,
            message: `No user found.`,
            data: [],
          });
        }
        for (let j = 0; j < getFeatured.length; j++) {
          const getCollectionData = await collection.findOne({
            _id: getFeatured[j].collectionId,
          });
          if (!getCollectionData) {
            return res.json({
              success: false,
              message: `No collections to show.`,
              data: [],
            });
          }
          getFeatured[j] = {
            ...getFeatured[j]._doc,
            collectionName: getCollectionData.collectionName,
            artistName: getUserData.username,
          };

          finalObj.push(getFeatured[j]);
        }
        return res.json({
          success: true,
          nfts: finalObj,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.getFeaturedRequests = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (
        req.perm.perm[i][0].name == req.perm.str &&
        req.perm.perm[i][0].group == "admin"
      ) {
        console.log(`req.userdata : `, req.userData);
        console.log(`req.perm.perm[${i}][0].name : `, req.perm.perm[i][0].name);
        console.log(`req.perm.str : `, req.perm.str);
        const featuredRequests = await nft.find({
          listing: true,
          featured: true,
          reqStatus: "pending",
        });
        if (featuredRequests.length < 1) {
          return res.json({
            success: false,
            message: `No NFT's are requested yet to be featured.`,
            data: [],
          });
        }
        return res.json({
          success: true,
          result: featuredRequests,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.responseFeaturedRequests = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["status"], req.body);
    if (_errors.length > 0) {
      return res.send(_errors);
    }

    console.log(`body : `, req.body.status);

    // if (req.body.status != "approved" || req.body.status != "rejected") {
    //   return res.json({
    //     success: false,
    //     message: `status has to be approved or rejected.`,
    //     result: req.body.status
    //   });
    // }

    for (let i = 0; i < req.perm.perm.length; i++) {
      if (
        req.perm.perm[i][0].name == req.perm.str &&
        req.perm.perm[i][0].group == "admin"
      ) {
        // console.log(`req.perm.perm[${i}][0].name : `, req.perm.perm.name);
        // console.log(`req.perm.str : `, req.perm.str);

        const getNft = await nft.findOne({
          _id: req.params.nftId,
          listing: true,
          featured: true,
          reqStatus: "pending",
        });
        if (!getNft) {
          return res.json({
            success: false,
            message: `This NFT is already responded with the status.`,
            data: [],
          });
        }
        (getNft.reqStatus = req.body.status), await getNft.save();
        return res.json({
          success: true,
          message: `NFT approved successfully.`,
          getNft,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
