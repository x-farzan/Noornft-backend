const nft = require("../models/nft");
const featuredNfts = require("../models/featurednfts");
const featurednfts = require("../models/featurednfts");
const collections = require("../models/collections");

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

        // check if already available in featured.
        const checkFeaturedNft = await featuredNfts.findOne({
          nftId: checkNft._id,
        });

        if (checkFeaturedNft && checkFeaturedNft.reqStatus == "approved") {
          return res.json({
            success: false,
            message: `NFT is already in featured list.`,
          });
        } else if (
          checkFeaturedNft &&
          checkFeaturedNft.reqStatus == "pending"
        ) {
          return res.json({
            success: false,
            message: "NFT is currently under review.",
          });
        }

        // creating NFT as featured.
        const newFeatured = await new featuredNfts({
          nftId: checkNft._id,
          reqStatus: "pending",
        });
        await newFeatured.save();
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
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        let obj = [];
        let finalObj = [];
        const getFeaturedNfts = await featuredNfts.find();
        if (getFeaturedNfts.length < 1) {
          return res.json({
            success: false,
            message: "No featured NFT's to show.",
          });
        }
        for (let i = 0; i < getFeaturedNfts.length; i++) {
          if (getFeaturedNfts[i].reqStatus == "approved") {
            finalObj.push(getFeaturedNfts[i]);
          }
        }
        // for (let i = 0; i < finalObj.length; i++) {
        //   const getNft = await nft.findOne({
        //     nftId: finalObj[i].nftId,
        //     listing: true,
        //   });
        //   if (!getNft) {
        //     return res.json({
        //       success: false,
        //       message: `NFT not found.`,
        //     });
        //   }
        //   const getCollection = await collections.findOne({
        //     _id: getNft.collectionId,
        //   });
        //   if (!getCollection) {
        //     return res.json({
        //       success: false,
        //       message: `Collection not found.`,
        //     });
        //   }
        //   obj.push({ getNft, collectionName: getCollection.collectionName });
        // }
        return res.json({
          success: true,
          result: finalObj,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
