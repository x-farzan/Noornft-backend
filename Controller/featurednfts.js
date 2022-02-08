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
    console.time("Get featured NFTS");
    if (!req.query.page) {
      return res.json({
        success: false,
        message: `Filteration parameters not passed.`,
      });
    }
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getFeatured = await nft
          .find({
            artistId: req.userData.id,
            featured: true,
            reqStatus: "approved",
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
        if (getFeatured.length < 1) {
          return res.json({
            success: false,
            message: `No featured NFT's to show or NFT has not been approved by the admin.`,
            paginated: [],
          });
        }
        console.timeEnd("Get featured NFTS");

        return res.json({
          success: true,
          paginated: getFeatured,
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
    console.time("get featured nfts on homepage");
    const getNfts = await nft
      .find({
        featured: true,
        reqStatus: "approved",
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
      ])
      .sort({ createdAt: -1 });
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's to show.`,
      });
    }
    console.timeEnd("get featured nfts on homepage");

    return res.json({
      success: true,
      paginated: getNfts,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
