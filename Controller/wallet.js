var cardanoSerializationLibNodejs = require("@emurgo/cardano-serialization-lib-nodejs");

convertHexToAddress = (hexAddress) => {
  console.log("IN the function : ===>>> ");
  const addr = cardanoSerializationLibNodejs.Address.from_bytes(
    Buffer.from(hexAddress, "hex")
  );
  console.log("converted address : ", addr.to_bech32());
  return addr.to_bech32();
};

module.exports = { convertHexToAddress };
