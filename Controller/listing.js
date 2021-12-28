const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");

exports.makeListed = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        console.log(`here`);
        let _errors = userFieldsValidator(["price"], req.body);
        if (_errors > 0) {
          return res.json({
            _errors,
          });
        }

        console.log(`here`);
        const getNfts = await nft.findOne({ _id: req.params.nftId });
        console.log(`getNfts : `, getNfts);
        if (!getNfts) {
          return res.json({
            success: false,
            message: `NFT with this id not exists.`,
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
        const getCollections = await collection.find({
          artist: req.userData.id,
        });
        if (getCollections.length < 1) {
          return res.json({
            success: false,
            message: `You haven't created any collection yet!`,
          });
        }
        for (let i = 0; i < getCollections.length; i++) {
          const getNfts = await nft.find({
            collectionId: getCollections[i]._id,
            listing: true,
          });
          if (getNfts.length < 1) {
            return res.json({
              success: false,
              message: `No nfts available to show.`,
            });
          }
          return res.json({
            success: true,
            getNfts,
          });
        }
      }
    }
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};
