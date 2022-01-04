const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const featuredPrices = require("../models/featuredPrices");

exports.addFeaturedprices = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["select", "price"], req.body);
    if (_errors.length > 0) {
      return res.json({
        _errors,
      });
    }

    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        if (req.body.select == "mainBanner") {
          const getMainBanner = await featuredPrices.findOne({
            mainBanner: true,
          });
          if (getMainBanner) {
            return res.json({
              success: false,
              message:
                "Main banner price is already available. Delete to add a new one.",
            });
          }
          const newfeaturedPrices = new featuredPrices({
            mainBanner: true,
            mainBannerPrice: req.body.price,
          });
          await newfeaturedPrices.save();
          return res.json({
            success: true,
            message: `Main banner price successfully updated.`,
            newfeaturedPrices,
          });
        } else if (req.body.select == "secondarySlider") {
          const getSecondarySlider = await featuredPrices.findOne({
            secondarySlider: true,
          });
          // console.log(`secondary banner : `, getSecondaryBanner);
          if (getSecondarySlider) {
            return res.json({
              success: false,
              message:
                "Secondary Slider price is already available. Delete to add a new one.",
            });
          }
          const newfeaturedPrices = new featuredPrices({
            secondarySlider: true,
            secondarySliderPrice: req.body.price,
          });
          await newfeaturedPrices.save();
          return res.json({
            success: true,
            message: `Secondary slider price successfully updated.`,
            newfeaturedPrices,
          });
        } else {
          return res.json({
            success: false,
            message: `Either select or price is missing.`,
          });
        }
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.getFeaturedPrices = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      const getItem = await featuredPrices.find();
      if (getItem.length < 1) {
        return res.json({
          success: false,
          message: `No featured prices found.`,
        });
      }
      return res.json({
        success: true,
        getItem,
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.updateFeaturedPrices = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["price", req.body]);
    if (_errors.length > 0) {
      return res.json({
        _errors,
      });
    }
    for (let i = 0; i < req.perm.perm.length; i++) {
      console.log(req.perm.perm[i][0].name);
      console.log(req.perm.str);
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getItem = await featuredPrices.findOne({ _id: req.params.id });
        if (!getItem) {
          return res.json({
            success: false,
            message: `You cannot edit unless you create featured price.`,
          });
        }
        if (getItem.mainBanner == true) {
          getItem.mainBannerPrice = req.body.price;
          await getItem.save();
        } else if (getItem.secondarySlider == true) {
          getItem.secondarySliderPrice = req.body.price;
          await getItem.save();
        }
        return res.json({
          success: true,
          message: `Price updated successfully.`,
          getItem,
        });
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.deleteFeaturedPrices = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      console.log(req.perm.perm[i][0].name);
      console.log(req.perm.str);
      if (req.perm.perm[i][0].name == req.perm.str) {
        const getItem = await featuredPrices.findOne({ _id: req.params.id });
        if (!getItem) {
          return res.json({
            success: false,
            message: `No item found.`,
          });
        }
        const deleteDoc = await featuredPrices.deleteOne({
          _id: req.params.id,
        });
        if (deleteDoc) {
          return res.json({
            success: true,
            message: `Featured price removed successfully.`,
            getItem,
          });
        }
      }
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
