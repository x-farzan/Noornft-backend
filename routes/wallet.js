const express = require("express");
const router = express.Router();
const controller = require("../Controller/wallet");

router.route("/getaddress").post((req, res) => {
  try {
    const hexAddress = req.body.address
    // console.log("address : ", address);
    const response = controller.convertHexToAddress(hexAddress);
    return res.json({
      address : response,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

module.exports = router;
