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

        checkNft.featured = true;
        checkNft.reqStatus = "pending";
        if (req.body.mainPrice && !req.body.secondaryPrice) {
          checkNft.mainBannerPrice = req.body.mainPrice;
        } else if (req.body.secondaryPrice && !req.body.mainPrice) {
          checkNft.secondarySliderPrice = req.body.secondaryPrice;
        } else if (req.body.mainPrice && req.body.secondaryPrice) {
          checkNft.mainBannerPrice = req.body.mainPrice;
          checkNft.secondarySliderPrice = req.body.secondaryPrice;
        } else {
          return res.json({
            success: false,
            message: `Please select price to get this featured.`,
          });
        }

        await checkNft.save();
        return res.json({
          success: true,
          message: `Your request to make "${checkNft.title}" has been requested to approve.`,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
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
          // reqStatus: "pending",
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
      // console.log(`im in`);
      console.log(req.perm.perm[i][0].name);
      console.log(req.perm.str);
      if (
        req.perm.perm[i][0].name == req.perm.str
        // &&
        // req.perm.perm[i][0].group == "admin"
      ) {
        // console.log(`req.perm.perm[${i}][0].name : `, req.perm.perm.name);
        // console.log(`req.perm.str : `, req.perm.str);

        const getNft = await nft.findOne({
          _id: req.params.nftId,
          listing: true,
          featured: true,
          reqStatus: "pending",
        });
        console.log(`getNft`, getNft);
        if (!getNft) {
          return res.json({
            success: false,
            message: `This NFT is already responded with the status.`,
            data: [],
          });
        }
        if (req.body.status == "approved") {
          getNft.reqStatus = req.body.status;
        } else if (req.body.status == "rejected") {
          getNft.reqStatus = req.body.status;
          // getNft.featured = false;
          // getNft.mainBannerPrice = 0;
          // getNft.secondarySliderPrice = 0;
        }
        await getNft.save();
        return res.json({
          success: true,
          message: `NFT ${req.body.status} successfully.`,
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

exports.getFeaturedNftsOnHomePage = async (req, res) => {
  try {
    let finalObj = [];
    const getNfts = await nft.find({
      featured: true,
      reqStatus: "approved",
    });
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's to show.`,
      });
    }

    console.log(`getNfts : `, getNfts[0]);

    for (let i = 0; i < getNfts.length; i++) {
      console.log(getNfts[i].artistId);
      const getUser = await User.findOne({ _id: getNfts[i].artistId });
      if (!getUser) {
        return res.json({
          success: false,
          message: `User not found`,
        });
      }
      console.log(`getUser `, getUser);
      const getCollection = await collection.findOne({
        _id: getNfts[i].collectionId,
      });
      if (!getCollection) {
        return res.json({
          success: false,
          message: `No collections to show.`,
        });
      }
      finalObj.push({
        ...getNfts[i]._doc,
        collectionName: getCollection.name,
        username: getUser.username,
      });
    }

    return res.json({
      success: true,
      finalObj,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
