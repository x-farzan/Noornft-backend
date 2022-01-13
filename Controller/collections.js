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

exports.deleteCollection = async (req, res) => {
  // const id = req.params.id;
  for (let i = 0; i < req.perm.perm.length; i++) {
    if (req.perm.perm[i][0].name == req.perm.str) {
      console.log(req.perm.perm[i][0].name);
      console.log(req.perm.str);
      const getResult = await collection.findOne({ _id: req.params.id });
      console.log(`get result : `, getResult);
      if (getResult) {
        const result = await collection.deleteOne({ _id: req.params.id });
        if (result) {
          return res.json({
            success: true,
            message: `Collection successfully deleted.`,
          });
        }
        return res.json({
          success: false,
          message: `Collection deletion not occured.`,
        });
      } else {
        return res.json({
          success: false,
          message: `Collection not available.`,
        });
      }
    }
  }
};

exports.searchCollection = async (req, res) => {
  try {
    if (!req.query.value) {
      return res.json({
        success: false,
        message: `Type in to search something.`,
      });
    }

    const query = req.query.value;
    const is_available = await collection.find({
      collectionName: { $regex: query, $options: "i" },
    });
    if (is_available.length < 1) {
      return res.json({
        success: false,
        message: `No collections found with this name.`,
      });
    }

    return res.json({
      success: true,
      is_available,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.allCollections = async (req, res) => {
  try {
    const _collections = await collection.find();
    if (_collections.length < 1) {
      return res.json({
        success: false,
        message: `No collections available to show.`,
        collections: [],
      });
    }
    return res.json({
      success: true,
      collections: _collections,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
