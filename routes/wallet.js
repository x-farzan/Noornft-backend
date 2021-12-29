const express = require("express");
const router = express.Router();
const controller = require("../Controller/wallet");
const { tokenVerifier } = require("../middleware/tokenVerifier");

router.route("/getaddress").post((req, res) => {
  try {
    console.log(`BODY : `, req.body);
    const hexAddress = req.body.address;
    console.log("address : ", req.body.address);
    const response = controller.convertHexToAddress(hexAddress);
    return res.json({
      address: response,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

router.post('/add', tokenVerifier, controller.addWallet)


module.exports = router;
