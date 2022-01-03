const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");
const User = require("../models/User");

exports.makeListed = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        console.log(`here`);
        let _errors = userFieldsValidator(["price"], req.body.price);
        if (_errors > 0) {
          return res.json({
            _errors,
          });
        }

        console.log(`here`);
        const getNfts = await nft.findOne({
          _id: req.params.nftId,
          listing: false,
          featured: false,
        });
        console.log(`getNfts : `, getNfts);
        if (!getNfts) {
          return res.json({
            success: false,
            message: `NFT with this id not exists.`,
            data: [],
          });
        }
        getNfts.listing = true;
        getNfts.price = req.body.price;
        await getNfts.save();
        return res.json({
          success: true,
          result: getNfts,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.myListingNfts = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        let finalObj = [];
        const getNfts = await nft.find({
          artistId: req.userData.id,
          listing: true,
        });
        console.log(getNfts);
        if (getNfts.length < 1) {
          return res.json({
            success: false,
            message: `No NFT's to show.`,
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
        for (let j = 0; j < getNfts.length; j++) {
          const getCollectionData = await collection.findOne({
            _id: getNfts[j].collectionId,
          });
          if (!getCollectionData) {
            return res.json({
              success: false,
              message: `No collections to show.`,
              data: [],
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
  // try {
  //   for (let i = 0; i < req.perm.perm.length; i++) {
  //     if (req.perm.perm[i][0].name == req.perm.str) {
  //       const getCollections = await collection.find({
  //         artist: req.userData.id,
  //       });
  //       if (getCollections.length < 1) {
  //         return res.json({
  //           success: false,
  //           message: `You haven't created any collection yet!`,
  //         });
  //       }
  //       for (let i = 0; i < getCollections.length; i++) {
  //         const getNfts = await nft.find({
  //           collectionId: getCollections[i]._id,
  //           listing: true,
  //         });
  //         if (getNfts.length < 1) {
  //           return res.json({
  //             success: false,
  //             message: `No nfts available to show.`,
  //           });
  //         }
  //         return res.json({
  //           success: true,
  //           getNfts,
  //         });
  //       }
  //     }
  //   }
  // } catch (error) {
  //   return res.json({
  //     error: error,
  //   });
  // }
};

exports.removeNftFromListing = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      console.log(req.perm.perm[i][0].name);
      console.log(req.perm.str);
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getListedNft = await nft.findOne({
          _id: req.params.nftId,
          artistId: req.userData.id,
          listing: true,
        });
        if (!getListedNft) {
          return res.json({
            success: false,
            message: `You haven't listed NFT's.`,
            data: [],
          });
        }
        (getListedNft.listing = false),
          (getListedNft.featured = false),
          (getListedNft.reqStatus = null);
        await getListedNft.save();
        return res.json({
          success: true,
          message: `NFT successfully removed from the listing.`,
          getListedNft,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.marketplaceListing = async (req, res) => {
  try {
    let finalObj = [];
    const getNfts = await nft.find({
      listing: true,
    });
    console.log(getNfts);
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's to show.`,
        data: [],
      });
    }

    console.log(`NFTS : `, getNfts);

    // const getUserData = await User.findOne({ _id: req.userData.id });
    // if (!getUserData) {
    //   return res.json({
    //     success: false,
    //     message: `No user found.`,
    //     data: [],
    //   });
    // }

    for (let j = 0; j < getNfts.length; j++) {
      const getUserData = await User.findOne({ _id: getNfts[j].artistId });
      if (!getUserData) {
        return res.json({
          success: false,
          message: `No user found.`,
        });
      }
      const getCollectionData = await collection.findOne({
        _id: getNfts[j].collectionId,
      });
      if (!getCollectionData) {
        return res.json({
          success: false,
          message: `No collections to show.`,
          data: [],
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
    return res.json({
      success: true,
      nfts: finalObj,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.priceRangeSearch = async (req, res) => {
  try {
    let nfts = [];
    let _errors = userFieldsValidator(["maxPrice", "minPrice"], req.body);
    if (_errors.length > 1) {
      return res.json({
        _errors,
      });
    }

    // if (
    //   req.body.minPrice > req.body.maxPrice ||
    //   req.body.maxPrice < req.body.minPrice
    // ) {
    //   console.log(req.body.minPrice);
    //   console.log(req.body.maxPrice);

    //   return res.json({
    //     success: false,
    //     message: `Entered price range is not correct.`,
    //   });
    // }

    const getNfts = await nft.find({
      listing: true,
    });
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's available yet.`,
        data: [],
      });
    }

    for (let i = 0; i < getNfts.length; i++) {
      if (
        getNfts[i].price >= req.body.minPrice &&
        getNfts[i].price <= req.body.maxPrice
      ) {
        nfts.push(getNfts[i]);
      }
    }

    if (nfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's in this price range.`,
        data: [],
      });
    }

    return res.json({
      success: true,
      nfts,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.addCount = async (req, res) => {
  try {
    const getNft = await nft.findOne({
      _id: req.params.nftId,
      listing: true,
    });
    if (!getNft) {
      return res.json({
        success: false,
        message: `No NFT found.`,
        data: [],
      });
    }

    getNft.viewCount = getNft.viewCount + 1;
    await getNft.save();

    return res.json({
      success: true,
      result: getNft,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.viewCount = async (req, res) => {
  try {
    const getNft = await nft.findOne({
      _id: req.params.nftId,
      listing: true,
    });
    if (!getNft) {
      return res.json({
        success: false,
        message: `No NFT found.`,
        data: [],
      });
    }

    return res.json({
      success: true,
      result: getNft,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.getFiltered = (req, res) => {
  try {
    console.log(req.query.filterWith);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
