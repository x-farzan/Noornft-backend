const collection = require("../models/collections");
const user = require("../models/User");
const { userFieldsValidator } = require("../helpers/userFieldsValidator");

exports.createCollection = async (req, res) => {
  const _errors = userFieldsValidator(["collectionName"], req.body);
  if (_errors.length > 0) {
    return res.send(_errors);
  }

  for (let i = 0; i < req.perm.perm.length; i++) {
    if (req.perm.perm[i][0].name == req.perm.str) {
      const result = await collection.findOne({
        collectionName: req.body.collectionName,
      });
      if (!result) {
        const newCollection = new collection({
          collectionName: req.body.collectionName,
          artist: req.userData.id,
        });
        await newCollection.save();
        return res.json({
          success: true,
          newCollection,
        });
      }
      return res.json({
        success: false,
        message: "Collection with this name already exists.",
      });
    }
  }
};

exports.getCollections = async (req, res) => {
  for (let i = 0; i < req.perm.perm.length; i++) {
    if (req.perm.perm[i][0].name == req.perm.str) {
      const result = await collection.find({ artist: req.userData.id });
      if (result.length < 1) {
        return res.json({
          success: false,
          message: "No collections to show.",
        });
      }
      return res.json({
        success: true,
        result,
      });
    }
  }

  // const id = req.params.id;
};
