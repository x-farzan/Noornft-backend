const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");
const User = require("../models/User");
const { paginator } = require("../helpers/arrayPaginator");

exports.makeListed = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
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
    console.time("My listing");
    if (!req.query.page) {
      return res.json({
        success: false,
        messgae: `FIltered parameters are not passed`,
      });
    }

    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getNfts = await nft
          .find({
            artistId: req.userData.id,
            listing: true,
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
        if (getNfts.length < 1) {
          return res.json({
            success: false,
            message: `No NFT's to show.`,
            paginated: [],
          });
        }
        console.timeEnd("My listing");

        return res.json({
          success: true,
          paginated: getNfts,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
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
          (getListedNft.reqStatus = "null");
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

exports.editPrice = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["editprice"], req.body);
    if (_errors.length > 0) {
      return res.json(_errors);
    }
    if (!req.params.nftId) {
      return res.json({
        success: false,
        message: `Please provide the NFT id to edit price.`,
      });
    }

    const _nft = await nft.findOne({
      _id: req.params.nftId,
      listing: true,
    });
    if (!_nft) {
      return res.json({
        success: false,
        message: "NFT is not available.",
      });
    }
    _nft.price = req.body.editprice;
    await _nft.save();
    return res.json({
      success: true,
      message: `Price updated successfully.`,
      result: _nft,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.marketplaceListing = async (req, res) => {
  console.time("marketplace listing");
  try {
    if (!req.query.page) {
      return res.json({
        success: false,
        message: `Filtering parameters are not passed.`,
      });
    }

    const getNfts = await nft
      .find({
        listing: true,
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
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's to show.`,
      });
    }
    console.timeEnd("marketplace listing");

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

// Helper function for function "filterMarketplaceListing"
exports.sortFunction = async (_obj, req, pageNo) => {
  if (req == "newest") {
    is_nft_available = await nft
      .find(_obj)
      .sort({ createdAt: -1 })
      .limit(12 * pageNo)
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
  } else if (req == "oldest") {
    is_nft_available = await nft
      .find(_obj)
      .sort({ createdAt: 1 })
      .limit(12 * pageNo)
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
  } else if (req == "highestprice") {
    is_nft_available = await nft
      .find(_obj)
      .sort({ price: -1 })
      .limit(12 * pageNo)
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
  } else if (req == "lowestprice") {
    is_nft_available = await nft
      .find(_obj)
      .sort({ price: 1 })
      .limit(12 * pageNo)
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
  } else {
    return "Passed sort parameter is not valid.";
  }
  if (is_nft_available.length < 1) {
    return "No NFT's available to show.";
  }
  return is_nft_available;
};

exports.filterMarketplaceListing = async (req, res) => {
  try {
    console.time("Filter marketplace");
    if (Object.keys(req.body).length == 0) {
      return res.json({
        success: false,
        message: `Please provide some filter parameters.`,
      });
    }

    let is_nft_available;
    let finalObj = [];
    let _obj = req.body;

    _obj = { ..._obj, listing: true };

    //Modifying object
    if (_obj.artistId == "") {
      delete _obj.artistId;
    }
    if (_obj.collectionId == "") {
      delete _obj.collectionId;
    }
    if (req.body.minPrice == "" && req.body.maxPrice == "") {
      delete _obj.minPrice;
      delete _obj.maxPrice;
    }
    if (req.body.sort == "") {
      delete _obj.sort;
    }

    if (_obj.minPrice && _obj.maxPrice && !_obj.sort) {
      delete _obj.minPrice;
      delete _obj.maxPrice;
      _obj = {
        ..._obj,
        price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
      };
      is_nft_available = await nft
        .find(_obj)
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
    } else if (_obj.sort && !(_obj.minPrice && _obj.maxPrice)) {
      delete _obj.sort;
      is_nft_available = await this.sortFunction(
        _obj,
        req.body.sort,
        req.query.page
      );
    } else if (_obj.minPrice && _obj.maxPrice && _obj.sort) {
      delete _obj.minPrice;
      delete _obj.maxPrice;
      delete _obj.sort;
      _obj = {
        ..._obj,
        price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
      };
      is_nft_available = await this.sortFunction(
        _obj,
        req.body.sort,
        req.query.page
      );
    } else {
      is_nft_available = await nft
        .find(_obj)
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
    }

    if (is_nft_available.length < 1) {
      return res.json({
        success: false,
        message: "No NFT's to show.",
      });
    }
    console.timeEnd("Filter marketplace");

    return res.json({
      success: true,
      paginated: is_nft_available,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.priceRangeSearch = async (req, res) => {
  try {
    console.time("price range search");
    let _errors = userFieldsValidator(["maxPrice", "minPrice"], req.body);
    if (_errors.length > 1) {
      return res.json({
        _errors,
      });
    }

    if (!req.query.page) {
      return res.json({
        success: false,
        message: "Page is not passed.",
      });
    }

    if (
      req.body.minPrice < 0 ||
      req.body.maxPrice < 0 ||
      (req.body.minPrice < 0 && req.body.maxPrice < 0)
    ) {
      return res.json({
        success: false,
        message: `Entered value cannot be less than 0.`,
      });
    }

    const getNfts = await nft
      .find({
        listing: true,
        price: { $gte: req.body.minPrice, $lte: req.body.maxPrice },
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
    if (getNfts.length < 1) {
      return res.json({
        success: false,
        message: `No NFT's available yet.`,
        data: [],
      });
    }
    console.timeEnd("price range search");

    return res.json({
      success: true,
      nfts: getNfts,
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

exports.getFiltered = async (req, res) => {
  try {
    const filter = req.query.filterWith;
    if (filter == "newest") {
      const getNft = await nft.find({ listing: true }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        getNft,
      });
    } else if (filter == "oldest") {
      const getNft = await nft.find({ listing: true }).sort({ createdAt: 1 });
      return res.json({
        success: true,
        getNft,
      });
    } else if (filter == "highestprice") {
      const getNft = await nft.find({ listing: true }).sort({ price: -1 });
      return res.json({
        success: true,
        getNft,
      });
    } else if (filter == "lowestprice") {
      const getNft = await nft.find({ listing: true }).sort({ price: 1 });
      return res.json({
        success: true,
        getNft,
      });
    } else {
      return res.json({
        success: false,
        message: `Not a valid filter for search.`,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
