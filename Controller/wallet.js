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
    // Suggestion : add address in wallet model also on signup!!!

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
        });
      }
    }
    getUser.address.push(serializedAddress);
    await getUser.save();
    return res.json({
      success: true,
      message: `wallet address : ${serializedAddress} is successfully linked.`,
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
