var cardanoSerializationLibNodejs = require("@emurgo/cardano-serialization-lib-nodejs");
const { userFieldsValidator } = require("../helpers/userFieldsValidator");
const wallet = require("../models/wallet");
const User = require("../models/User");

exports.convertHexToAddress = (hexAddress) => {
  console.log("IN the function : ===>>> ");
  const addr = cardanoSerializationLibNodejs.Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  );
  console.log("converted address : ", addr.to_bech32());
  return addr.to_bech32();
};

exports.addWallet = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["address"], req.body);
    if (_errors.length > 1) {
      return res.json({
        _errors,
      });
    }

    const serializedAddress = this.convertHexToAddress(req.body.address);

    const getUser = await User.findOne({ _id: req.userData.id });
    console.log(getUser);
    if (!getUser) {
      return res.json({
        success: false,
        message: `You are not a registered user.`,
      });
    }
    for (let i = 0; i < getUser.address.length; i++) {
      console.log(getUser.address[i]);
      console.log(serializedAddress);
      if (getUser.address[i] == serializedAddress) {
        return res.json({
          success: false,
          message: `This wallet is already linked.`,
          result: serializedAddress,
        });
      }
    }
    getUser.address.push(serializedAddress);
    await getUser.save();
    return res.json({
      success: true,
      message: `wallet address : ${serializedAddress} is successfully linked.`,
      result: serializedAddress,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

exports.removeWallet = async (req, res) => {
  try {
    let _errors = userFieldsValidator(["address"], req.body);
    if (_errors.length > 1) {
      return res.json({
        _errors,
      });
    }

    console.log("body: ", req.body);

    const getUser = await User.findOne({ _id: req.userData.id });
    if (!getUser) {
      return res.json({
        success: false,
        message: `User not found.`,
      });
    }
    for (let i = 0; i < getUser.address.length; i++) {
      console.log(getUser.address[i]);
      console.log(req.body.address);
      if (getUser.address[i] == req.body.address) {
        console.log("im hereee");
        getUser.address.pull(req.body.address);
        await getUser.save();
        return res.json({
          success: true,
          message: `address : ${req.body.address} removed successfully.`,
          result: req.body.address,
        });
      }
    }
    return res.json({
      success: false,
      message: `This wallet address is not linked with this user and cannot be removed.`,
    });
  } catch (error) {
    error: error.message;
  }
};

exports.addPrimaryWallet = async (req, res) => {
  try {
    // const { primaryAddress } = req.body.primaryAddress;
    const _user = await User.findOne({ _id: req.userData.id });

    // Check if any wallet is attached before making primary.
    if (_user.address.length < 1) {
      return res.json({
        success: false,
        message: "Please attach atleast one wallet to make primary.",
        data: [],
      });
    }
    8
    if (
      !_user.primaryAddress ||
      _user.primaryAddress != req.body.primaryAddress
    ) {
      _user.primaryAddress = req.body.primaryAddress;
      _user.primaryAddressStatus = "pending"
      await _user.save();
      console.log("USER : ", _user);
      return res.json({
        success: false,
        message:
          "You have applied for the wallet verification. You will soon be responded with the status.",
        data: [],
      });
    } else {
      return res.json({
        success: false,
        message: "The address is already selected as the primary address.",
        data: [],
      });
    }
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
