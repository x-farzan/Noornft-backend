const nft = require("../models/nft");
const featuredNfts = require("../models/featurednfts");
const featurednfts = require("../models/featurednfts");
const User = require("../models/User");
const collection = require("../models/collections");

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
          });
        }
        if (checkNft.featured == true && checkNft.reqStatus == "pending") {
          return res.json({
            success: false,
            message: `NFT is already requested for approval.`,
          });
        } else if (
          checkNft.featured == true &&
          checkNft.reqStatus == "approved"
        ) {
          return res.json({
            success: false,
            message: `NFT is already approved and featured.`,
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
          });
        }
        const getUserData = await User.findOne({ _id: req.userData.id });
        if (!getUserData) {
          return res.json({
            success: false,
            message: `No user found.`,
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
            });
          }
          getFeatured[j] = {
            ...getFeatured[j]._doc,
            collectionName: getCollectionData.collectionName,
            artistName: getUserData.username,
          };
          // getNfts[j].collectionName = getCollectionData.collectionName;
          // getNfts[j].artistName = getUserData.flname;
          // console.log(getNfts[j]);
          finalObj.push(getFeatured[j]);
        }
        return res.json({
          success: true,
          nfts: finalObj,
        });

        // let obj = [];
        // let finalObj = [];
        // const getFeaturedNfts = await featuredNfts.find();
        // if (getFeaturedNfts.length < 1) {
        //   return res.json({
        //     success: false,
        //     message: "No featured NFT's to show.",
        //   });
        // }
        // for (let i = 0; i < getFeaturedNfts.length; i++) {
        //   if (getFeaturedNfts[i].reqStatus == "approved") {
        //     finalObj.push(getFeaturedNfts[i]);
        //   }
        // }
        // // for (let i = 0; i < finalObj.length; i++) {
        // //   const getNft = await nft.findOne({
        // //     nftId: finalObj[i].nftId,
        // //     listing: true,
        // //   });
        // //   if (!getNft) {
        // //     return res.json({
        // //       success: false,
        // //       message: `NFT not found.`,
        // //     });
        // //   }
        // //   const getCollection = await collections.findOne({
        // //     _id: getNft.collectionId,
        // //   });
        // //   if (!getCollection) {
        // //     return res.json({
        // //       success: false,
        // //       message: `Collection not found.`,
        // //     });
        // //   }
        // //   obj.push({ getNft, collectionName: getCollection.collectionName });
        // // }
        return res.json({
          success: true,
          result: getFeatured,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
