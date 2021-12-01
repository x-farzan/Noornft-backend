var axios = require("axios");
const { respondRequest } = require("./admin");

module.exports.upload = async (data) => {
  var config = {
    method: "post",
    url: "https://api-testnet.nft-maker.io/UploadNft/18896689bab346c8bf3e7080cbed3e10/5063",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios(config)
    .then(function (response) {
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
};
