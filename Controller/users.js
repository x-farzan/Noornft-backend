const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const upload = require("../middleware/fileUpload");
const User = require("../models/User");
const Nft = require("../models/nft");
require("dotenv").config();
const userFieldsValidator = require("../helpers/userFieldsValidator");
const fs = require("fs");
const path = require("path");
var axios = require("axios");
const pinataSDK = require("@pinata/sdk");
const { response } = require("express");
const pinata = pinataSDK(process.env.pinatakey1, process.env.pinatakey2);

postNewUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await upload(req, res);
    // if (req.file == undefined) {
    //   console.log('file----', req.file)
    //   return res.status(400).send({ message: "Choose a file to upload" });
    // }

    let user = await User.findOne({ address: req.body.address });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      await upload(req, res);
    }

    user = new User({
      // avatar : "http://localhost:5000/uploads/"+req.file.originalname.toLowerCase().split(' ').join('-'),
      flname: "",
      name: req.body.name.toLowerCase().split(" ").join("-"),
      email: req.body.email,
      // password,
      address: req.body.address,
      role: req.body.role,
      location: "",
      bio: "",
      website: "",
      avatar: "",
    });

    await user.save();

    res.status(200).send({
      message: "profile is created",
      user,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 500MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

userById = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.params.id });

    return res.status(200).send(user);
  } catch (error) {
    res.status(400).send("the user with given ID is not found");
  }
};

updateUserInfo = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      var user = await User.findOneAndUpdate(
        { address: req.params.address },
        {
          location: req.body.location,
          bio: req.body.bio,
          website: req.body.website,
          flname: req.body.flname.split(" ").join("-"),
        },
        { new: true }
      );
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User doesnt exist" }] });
      }
      res.status(200).send({
        message: "data is updated",
        user,
      });
    } else {
      var user = await User.findOneAndUpdate(
        { address: req.params.address },
        {
          avatar:
            `${process.env.HOST}/uploads/` +
            req.file.originalname.toLowerCase().split(" ").join("-"),

          // name : req.body.name.toLowerCase().split(' ').join('-'),
          // email : req.body.email,
          location: req.body.location,
          bio: req.body.bio,
          website: req.body.website,
          flname: req.body.flname.split(" ").join("-"),
        },

        { new: true }
      );
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "User doesnt exist" }] });
      }
    }

    await user.save();

    res.status(200).send({
      message: "user is updated",
      user,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 500MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

uploadnft = async (imageName) => {
  try {
    console.log(`entered in controler`);
    const isAuth = await pinata.testAuthentication();
    console.log(isAuth);
    console.log("yes");
    const readableStreamForFile = fs.createReadStream(
      path.join(__dirname, "../uploads", `${imageName}`)
    );
    console.log(readableStreamForFile.path);
    const result = await pinata.pinFileToIPFS(readableStreamForFile);
    console.log("file uploaded succesfully...", result);
    const filehash = `${result.IpfsHash}`;
    console.log("done", filehash);
    return JSON.stringify(filehash);
  } catch (error) {
    console.log(`Error : `, error);
  }
};

uploadNftInfo = async (data) => {
  console.log("DATA BEFORE ====>>>>  ", data);
  const projectId = data.projectId;
  delete data.projectId;
  console.log("DATA AFTER ====>>>>  ", data);
  var config = {
    method: "post",
    url: `https://api-testnet.nft-maker.io/UploadNft/4d66545234de4c8e83cd36547a68be35/${projectId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios(config)
    .then(function (response) {
      console.log("second ==============>", response);
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return response;
};

getProfile = async (_id) => {
  const profile = await User.find({ _id: _id })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return JSON.stringify(`User with this id doen't exists.`);
      }
      console.log("USER C : ===============================>>>>", user[0]);
      return user[0];
    })
    .catch((err) => {
      return JSON.stringify("Something went wrong.");
    });
  return profile;
};

mintAndSend = async (nftId, address) => {
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/MintAndSendSpecific/4d66545234de4c8e83cd36547a68be35/5116/${nftId}/1/${address}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios(config)
    .then(function (response) {
      console.log(
        "======================================================================="
      );
      console.log("RESPONSE ================>>>>>>>>", response);
      console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

showAddress = async (projectId, nftId) => {
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/GetAddressForSpecificNftSale/4d66545234de4c8e83cd36547a68be35/${projectId}/${nftId}/1/6500000`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios(config)
    .then((response) => {
      console.log(
        "==============================SHOW ADDRESS========================================="
      );
      console.log("RESPONSE ================>>>>>>>>", response);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

checkAddress = async (projectId, address) => {
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/CheckAddress/4d66545234de4c8e83cd36547a68be35/${projectId}/${address}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios(config)
    .then((response) => {
      console.log(
        "==============================CHECK ADDRESS========================================="
      );
      console.log("RESPONSE ================>>>>>>>>", response);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

createProject = async (data) => {
  // console.log('here is the data : ', data);
  var config = {
    method: "post",
    url: `https://api-testnet.nft-maker.io/CreateProject/4d66545234de4c8e83cd36547a68be35`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await axios(config)
    .then((response) => {
      console.log(
        "==============================CREATE PROJECT========================================="
      );
      console.log("RESPONSE ================>>>>>>>>", response);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

setProjectId = async (projectId, _id) => {
  try {
    console.log(`projectId is here : `, projectId);
    const response = await User.findOne({ _id: _id })
      .then(async (user) => {
        if (user.length < 1) {
          return { msg: "User with this id does not exists." };
        }
        if (!user.projectId || user.projectId == null) {
          user.projectId = projectId;
          await user.save();
          return user;
        } else {
          return { msg: `Your project is already created` };
        }
      })
      .catch((error) => {
        console.log("ERROR: ===>>> ", error);
        return error;
      });
    return response;
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
};

getAllNftsProjectId = async () => {
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/ListProjects/4d66545234de4c8e83cd36547a68be35`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios(config)
    .then((response) => {
      console.log(
        "==============================GET PROJECT ID's========================================="
      );
      console.log("RESPONSE ================>>>>>>>>", response.data);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

getAllNfts = async (nftProjectId) => {
  let allnfts = [];
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/GetNfts/4d66545234de4c8e83cd36547a68be35/${nftProjectId}/reserved`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  let response = await axios(config)
    .then((response) => {
      console.log(
        "==============================GET NFTS========================================="
      );
      // console.log("RESPONSE ================>>>>>>>>", response);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      // console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

getAllNftsOfProject = async (nftProjectId) => {
  let allnfts = [];
  var config = {
    method: "get",
    url: `https://api-testnet.nft-maker.io/GetNfts/4d66545234de4c8e83cd36547a68be35/${nftProjectId}/free`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  let response = await axios(config)
    .then((response) => {
      console.log(
        "==============================GET NFTS========================================="
      );
      // console.log("RESPONSE ================>>>>>>>>", response);
      // console.log("RESPONSE.DATA==============>", response.data);
      return response.data;
    })
    .catch(function (error) {
      // console.log(error);
      // console.log("eror ==============>>>>", error.response.data);
      const err = { error: error.response.data.errorMessage };
      return err;
    });
  return response;
};

postNftIdAndPrice = (_id, price) => {
  try {
    const response = Nft.find({ _id: _id })
      .then((result) => {
        if (result.length > 0) {
          console.log(`response : `, result);
          result[0].price = price;
          result[0].save();
          console.log(`result : `, result);
          return `posteddd`;
        }
        const nft = new Nft({
          _id: _id,
          price: price,
        });
        nft.save();
        return `posted`;
      })
      .catch((error) => {
        return res.json(error);
      });
  } catch (error) {
    return res.json(error);
  }
};

getNftIdAndPrice = async (_id) => {
  try {
    const response = await Nft.findOne({ _id: _id })
      .then((result) => {
        console.log(`result : `, result);
        if (result) {
          return {
            _id: _id,
            price: result.price,
          };
        }
        return `_id's not available`;
      })
      .catch((error) => {
        return res.json(error);
      });
    // console.log(`getting price : `, response);
    return response;
  } catch (error) {
    return res.json(error);
  }
};

profilePictureUpload = async (req, res) => {
  if (!req.file) {
    return res.json({
      success: false,
      message: `Please upload a file.`,
    });
  }

  const response = await User.findOne({ _id: req.userData.id });
  if (!response) {
    return res.json({
      success: false,
      message: `User doesn't exists.`,
    });
  }
  console.log(response);
  if (response.image) {
    return res.json({
      success: false,
      message: `Image already uploaded.`,
    });
  }

  response.image = req.file.path;
  await response.save();
  return res.json({
    success: false,
    message: `Profile picture uploaded successfully.`,
  });
};

profilePictureEdit = async (req, res) => {
  if (!req.file) {
    return res.json({
      success: false,
      message: `Please upload a file.`,
    });
  }

  const response = await User.findOne({ _id: req.userData.id });
  if (!response.image) {
    return res.json({
      success: false,
      message: `Please upload the image first.`,
    });
  }
  response.image = req.file.path;
  await response.save();
  return res.json({
    success: true,
    message: `Image edited successfully..`,
  });
};

getProfilePicture = async (req, res) => {
  const response = await User.findOne({ _id: req.userData.id });
  if (response) {
    return res.json({
      success: true,
      message: response.image,
    });
  }
  return res.json({
    success: false,
    message: `Image not available.`,
  });
};

logout = async (req, res) => {
  const response = await User.findOne({ _id: req.userData.id });
  if (response) {
    response.token = "";
    console.log(`response : `, response);
    await response.save();
    return res.json({
      success: true,
      message: `Logged out successfully.`,
    });
  } else {
    return res.json({
      success: false,
      message: `Not a user.`,
    });
  }
};

follow = async (req, res) => {
  console.log(`req.params.id : `, req.params.id);
  const responseOne = await User.findOne({ _id: req.params.id });
  if (!responseOne) {
    return res.json({
      success: false,
      message: `Not a user.`,
    });
  }

  if (responseOne.role !== "artist") {
    return res.json({
      success: false,
      message: `You cannot follow user other than artist.`,
    });
  }

  for (let i = 0; i < responseOne.followers.length; i++) {
    if (responseOne.followers[i] == req.userData.id) {
      return res.json({
        success: false,
        message: `You are already a follower of "${responseOne.flname}"`,
      });
    }
  }
  responseOne.followers.push(req.userData.id);
  await responseOne.save();

  const responseTwo = await User.findOne({ _id: req.userData.id });
  if (!responseTwo) {
    return res.json({
      success: false,
      message: `Not a user.`,
    });
  }

  responseTwo.following.push(req.params.id);
  await responseTwo.save();
  return res.json({
    success: true,
    message: `You are now following "${responseOne.flname}"`,
  });
};

unFollow = async (req, res) => {
  console.log(`req.params.id : `, req.params.id);
  const responseOne = await User.findOne({ _id: req.params.id });
  if (!responseOne) {
    return res.json({
      success: false,
      message: `Not a user.`,
    });
  }

  if (responseOne.role !== "artist") {
    return res.json({
      success: false,
      message: `You cannot unfollow user other than artist.`,
    });
  }

  if (responseOne.followers.length == 0) {
    return res.json({
      success: false,
      message: `You are not a follower of "${responseOne.flname}"`,
    });
  }

  for (let i = 0; i < responseOne.followers.length; i++) {
    console.log(`In the loop`);
    console.log(typeof responseOne.followers[i]);
    console.log(req.userData.id);
    if (responseOne.followers[i] != req.userData.id) {
      return res.json({
        success: false,
        message: `You are not a follower of "${responseOne.flname}"`,
      });
    }
  }

  responseOne.followers.pop(req.userData.id);
  await responseOne.save();

  const responseTwo = await User.findOne({ _id: req.userData.id });
  if (!responseTwo) {
    return res.json({
      success: false,
      message: `Not a user.`,
    });
  }

  responseTwo.following.pop(req.params.id);
  await responseTwo.save();
  return res.json({
    success: true,
    message: `You are now unfollowing "${responseOne.flname}"`,
  });
};

module.exports = {
  postNewUser,
  userById,
  updateUserInfo,
  uploadnft,
  uploadNftInfo,
  getProfile,
  mintAndSend,
  showAddress,
  checkAddress,
  setProjectId,
  createProject,
  getAllNftsProjectId,
  getAllNfts,
  getAllNftsOfProject,
  postNftIdAndPrice,
  getNftIdAndPrice,
  profilePictureUpload,
  profilePictureEdit,
  getProfilePicture,
  logout,
  follow,
  unFollow,
};
