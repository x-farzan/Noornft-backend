const featuredPrices = require("../models/featuredPrices");

exports.addFeaturedprices = async (req, res) => {
  try {
    for (let i = 0; i < req.perm.perm.length; i++) {
      if (req.perm.perm[i][0].name == req.perm.str) {
        if (req.body.primaryBanner && !req.body.secondaryBanner) {
          const getPrimaryBanner = await featuredPrices.findOne({
            primaryBanner: true,
          });
          if (getPrimaryBanner) {
            return res.json({
              success: false,
              message:
                "Primary banner price is already available. Delete to add a new one.",
            });
          }
          const newfeaturedPrices = new featuredPrices({
            primaryBanner: true,
            primaryBannerValue: req.body.primaryBanner,
          });
          await newfeaturedPrices.save();
          return res.json({
            success: true,
            message: `Primary banner price successfully updated.`,
            newfeaturedPrices,
          });
        } else if (req.body.secondaryBanner && !req.body.primaryBanner) {
          const getSecondaryBanner = await featuredPrices.findOne({
            secondaryBanner: true,
          });
          console.log(`secondary banner : `, getSecondaryBanner);
          if (getSecondaryBanner) {
            return res.json({
              success: false,
              message:
                "Secondary banner price is already available. Delete to add a new one.",
            });
          }
          const newfeaturedPrices = new featuredPrices({
            secondaryBanner: true,
            secondaryBannerValue: req.body.secondaryBanner,
          });
          await newfeaturedPrices.save();
          return res.json({
            success: true,
            message: `Secondary banner price successfully updated.`,
            newfeaturedPrices,
          });
        } else {
          return res.json({
            success: false,
            message: `Please enter one price for featuring.`,
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
    console.log(`im in`);
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
        if (getItem.primaryBanner == true) {
          console.log(`here 1`);
          getItem.primaryBannerValue = req.body.value;
          await getItem.save();
        } else if (getItem.secondaryBanner == true) {
          console.log(`here 2`);
          getItem.secondaryBannerValue = req.body.value;
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
