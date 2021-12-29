var cardanoSerializationLibNodejs = require("@emurgo/cardano-serialization-lib-nodejs");
const wallet  = require('../models/wallet')

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
    const wallets = await wallet.findOne()
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};
