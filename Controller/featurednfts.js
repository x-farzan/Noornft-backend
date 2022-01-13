const nft = require("../models/nft");
const featuredNfts = require("../models/featurednfts");
const featurednfts = require("../models/featurednfts");
const User = require("../models/User");
const collection = require("../models/collections");
const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const { paginator } = require("../helpers/arrayPaginator");

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
    if (!req.query.page) {
      return res.json({
        success: false,
        message: `Filteration parameters not passed.`,
      });
    }
    let paginated;
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

    const status = req.body.status;
    if (status == "approved" || status == "rejected") {
      for (let i = 0; i < req.perm.perm.length; i++) {
        console.log(req.perm.perm[i][0].name);
        console.log(req.perm.str);
        if (req.perm.perm[i][0].name == req.perm.str) {
          const getNft = await nft.findOne({
            _id: req.params.nftId,
            listing: true,
            featured: true,
            reqStatus: "pending",
          });

          if (!getNft) {
            const is_available = await nft.findOne({ _id: req.params.nftId });
            if (!is_available) {
              return res.json({
                success: false,
                message: `NFT with this _id not exists.`,
              });
            }
            is_available.reqStatus = req.body.status;
            await is_available.save();
            return res.json({
              success: true,
              message: `NFT ${req.body.status} successfully.`,
            });
          }

          getNft.reqStatus = req.body.status;
          await getNft.save();
          return res.json({
            success: true,
            message: `NFT ${req.body.status} successfully.`,
            getNft,
          });
        }
      }
    } else {
      return res.json({
        success: false,
        message: `Status passed is not correct.`,
      });
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
        collectionName: getCollection.collectionName,
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
