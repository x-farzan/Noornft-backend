const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const nft = require("../models/nft");
const collection = require("../models/collections");

exports.createNft = async (req, res) => {
  try {
    let _errors = userFieldsValidator(
      ["title", "description", "externalLink", "category"],
      req.body
    );

    if (_errors.length > 0) {
      return res.send(_errors);
    }

    // checking collection, if available.
    const checkCollection = await collection.findOne({
      _id: req.params.collectionId,
    });
    if (checkCollection < 1) {
      return res.json({
        success: false,
        message: `Collection with this _id doesn't exists.`,
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
          externalLink: req.body.externalLink,
          collectionId: req.params.collectionId,
          category: req.body.category,
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
    console.log(req.perm);
    const getCollections = await collection.find({ artist: req.userData.id });
    if (getCollections.length < 1) {
      return res.json({
        success: false,
        message: `You haven't created any collection yet!`,
      });
    }
    for (let i = 0; i < getCollections.length; i++) {
      const getNfts = await nft.find({ collectionId: getCollections[i]._id });
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
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};
