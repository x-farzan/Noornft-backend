const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
// const upload = require("../middleware/fileUpload");
const User = require("../models/User");
const controller = require("../Controller/users");
const { tokenVerifier } = require("../middleware/auth");
const { upload } = require("../middleware/avatarUpload");

// @route    POST api/users
// @desc     Register user
// @access   Public

// post a new user
// router.post("/", controller.postNewUser);
// user find by DBs ID
// router.get("/:id", controller.userById);

// update user data

// router.put("/address/:address", controller.updateUserInfo);

router
  .route("/upload/nft")
  .post(upload.single("assetImage"), async (req, res) => {
    let imageName = req.file.path;
    imageName = imageName.substring(8, imageName.length);
    console.log("====================>>>>", imageName);
    const value = await controller.uploadnft(imageName);
    res.send(value);
  });

router.route("/upload/nft/info").post(async (req, res) => {
  const data = req.body;
  const value = await controller.uploadNftInfo(data);
  res.send(value);
});

router.route("/profile/:id").get(async (req, res) => {
  const _id = req.params.id;
  console.log("id : ;============================== >>>> ", _id);
  const user = await controller.getProfile(_id);
  console.log("USER : ===============================>>>>", user);
  return res.json({
    seccess: true,
    user,
  });
});

router.route("/mintAndSend/:nftId/:address").get(async (req, res) => {
  nftId = req.params.nftId;
  address = req.params.address;
  const response = await controller.mintAndSend(nftId, address);
  console.log("THIS IS RES : =====>>>>>>", response);
  return res.json(response);
});

router.route("/wallet/get/address/:nftId").get(async (req, res) => {
  nftId = req.params.nftId;
  console.log("NFTID : ====>>> ", nftId);
  const response = await controller.showAddress(nftId);
  // console.log("RESPONSE: =====>>> ", response);
  return res.send(response);
});

router.route("/wallet/checkaddress/state/:address").get(async (req, res) => {
  address = req.params.address;
  console.log("ADDRESS : ===>>> ", address);
  const response = await controller.checkAddress(address);
  return res.json(response);
});

router.route("/createProject").post(async (req, res) => {
  if (req.body.payoutWalletaddress == "") {
    return res.json({
      msg: `Artist wallet is not registered.`,
    });
  }
  const data = req.body;
  const response = await controller.createProject(data);
  return res.json(response);
});

router.route("/projectId/:_id").post(async (req, res) => {
  _id = req.params._id;
  projectId = req.body.projectId;
  const response = await controller.setProjectId(projectId, _id);
  return res.json(response);
});

router.route("/getnfts").get(async (req, res) => {
  try {
    let allNfts = [];
    let projectIds = [];
    const getAllNftsProjectId = await controller.getAllNftsProjectId();
    // console.log("response : ===>>> ", getAllNftsProjectId);

    getAllNftsProjectId.map((element) => {
      console.log(element.id);
      projectIds.push(element.id);
    });

    projectIds.forEach(async (element) => {
      await controller
        .getAllNfts(5116)
        .then((result) => {
          console.log("NFTS : ", result);
          allNfts.push(...result);
          // console.log("allNFts :", allNfts);
        })
        .catch(error);
    });

    console.log("allNfts", allNfts);
    return res.json({ allNfts });
  } catch (err) {
    res.json(err);
  }
});
// router
//   .route("/upload/nft/local")
//   .post(upload.single("uploadLocal"), async (req, res) => {
//     let imageName = req.file.path;
//     imageName = imageName.substring(8, imageName.length);
//     console.log("====================>>>>", imageName);
//     const value = await controller.uploadnft(imageName);
//     // return res.json(value)
//   });

module.exports = router;
