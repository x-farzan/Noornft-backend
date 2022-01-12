const express = require("express");
const router = express.Router();
const controller = require("../Controller/users");
const { tokenVerifier } = require("../middleware/tokenVerifier");
const { upload } = require("../middleware/avatarUpload");
const { paginator } = require("../helpers/arrayPaginator");

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
  // const projectId = req.body.projectid;
  const value = await controller.uploadNftInfo(data);
  res.send(value);
});

router.route("/profile/:id").get(async (req, res) => {
  let paginated;
  const _id = req.params.id;
  const user = await controller.getProfile(_id);
  user.image = `${process.env.server}/${user.image}`;
  // if (user.address.length < 1) {
  //   return res.json({
  //     success: false,
  //     message: `No wallets attached yet.`,
  //   });
  // }
  paginated = paginator(user.address, 4, req.query.page);
  return res.json({
    seccess: true,
    user,
    paginated,
  });
});

router.route("/mintAndSend/:nftId/:address").get(async (req, res) => {
  nftId = req.params.nftId;
  address = req.params.address;
  const response = await controller.mintAndSend(nftId, address);
  console.log("THIS IS RES : =====>>>>>>", response);
  return res.json(response);
});

router.route("/wallet/get/address/:projectId/:nftId").get(async (req, res) => {
  nftId = req.params.nftId;
  projectId = req.params.projectId;
  console.log("NFTID : ====>>> ", nftId);
  const response = await controller.showAddress(projectId, nftId);
  // console.log("RESPONSE: =====>>> ", response);
  return res.send(response);
});

router
  .route("/wallet/checkaddress/state/:projectId/:address")
  .get(async (req, res) => {
    address = req.params.address;
    projectId = req.params.projectId;
    console.log("ADDRESS : ===>>> ", address);
    const response = await controller.checkAddress(projectId, address);
    return res.json(response);
  });

router.route("/createProject").post(async (req, res) => {
  if (req.body.payoutWalletaddress == "") {
    return res.json({
      msg: `Artist wallet is not registered.`,
    });
  }
  const data = req.body;
  console.log(`here is the data `, data);
  // return res.send(data)
  const response = await controller.createProject(data);
  return res.json(response);
});

router.route("/projectId/:_id").post(async (req, res) => {
  console.log("I am here to check");
  let _id = req.params._id;
  console.log(`route _id : `, _id);
  let projectId = req.body.projectId;
  console.log(`projectId : `, projectId);
  const response = await controller.setProjectId(projectId, _id);
  return res.json(response);
});

router.route("/getnfts").get(async (req, res) => {
  try {
    let allNfts = [];
    let projectIds = [];
    let count = 0;
    const getAllNftsProjectId = await controller.getAllNftsProjectId();

    getAllNftsProjectId.map(async (element) => {
      if (element.free !== 0) {
        console.log(element.id);
        projectIds.push(element.id);
      }
    });

    projectIds.forEach(async (element) => {
      await controller
        .getAllNfts(element)
        .then((result) => {
          count++;
          console.log("result : ", result);
          console.log("count : ", count);
          console.log("length : ", projectIds.length);
          console.log("json length : ", result.length);
          result.forEach((item) => {
            item.pid = element;
          });
          allNfts.push(...result);
          console.log("All NFTS : ===>>> ", allNfts);
          if (count == projectIds.length) {
            return res.json(allNfts);
          }
        })
        .catch((error) => {
          return res.json({
            error: error.message,
          });
        });
    });
  } catch (err) {
    return res.json({ err: err.message });
  }
});

router.route("/featured").get(async (req, res) => {
  try {
    let allNfts = [];
    let projectIds = [];
    let count = 0;
    let randomIds = [];

    const getAllNftsProjectId = await controller.getAllNftsProjectId();

    // getting nft project ids that contain some nfts, empty projects are not extracted;
    getAllNftsProjectId.map(async (element) => {
      if (element.free !== 0) {
        console.log(element.id);
        projectIds.push(element.id);
      }
    });

    //getting '3' random project ids;
    for (let i = 0; i < 3; i++) {
      randomIds.push(projectIds[Math.floor(Math.random() * projectIds.length)]);
    }

    console.log("randomIds : ", randomIds);

    //getting nfts of projects;
    randomIds.forEach(async (element) => {
      await controller
        .getAllNfts(element)
        .then((result) => {
          count++;
          console.log("count : ", count);
          console.log("length : ", randomIds.length);
          if (result)
            result.forEach((item) => {
              item.pid = element;
            });
          allNfts.push(result[Math.floor(Math.random() * result.length)]);
          console.log("All NFTS : ===>>> ", allNfts);
          if (count == randomIds.length) {
            return res.json(allNfts);
          }
        })
        .catch((error) => {
          return res.json({
            error: error.message,
          });
        });
    });

    console.log("random : ", randomIds);
    console.log("projectIds ===>>> ", projectIds);
  } catch (err) {
    return res.json({ err: err.message });
  }
});

router.route("/getnftsofproject/:nftId").get(async (req, res) => {
  try {
    // let allNfts = [];
    // let projectIds = [];
    // let count = 0;
    nftProjectId = req.params.nftId;
    const getNftsOfProject = await controller.getAllNftsOfProject(nftProjectId);
    console.log("here : ", getNftsOfProject);
    return res.json({
      nfts: getNftsOfProject,
    });

    // getAllNftsProjectId.map(async (element) => {
    //   if (element.free !== 0) {
    //     console.log(element.id);
    //     projectIds.push(element.id);
    //   }
    // });

    // projectIds.forEach(async (element) => {
    //   await controller
    //     .getAllNfts(element)
    //     .then((result) => {
    //       count++;
    //       console.log("result : ", result);
    //       console.log("count : ", count);
    //       console.log("length : ", projectIds.length);
    //       console.log("json length : ", result.length);
    //       result.forEach((item) => {
    //         item.pid = element;
    //       });
    //       allNfts.push(...result);
    //       console.log("All NFTS : ===>>> ", allNfts);
    //       if (count == projectIds.length) {
    //         return res.json(allNfts);
    //       }
    //     })
    //     .catch((error) => {
    //       return res.json({
    //         error: error.message,
    //       });
    //     });
    // });
  } catch (err) {
    return res.json({ err: err.message });
  }
});

router.route("/postnftidandprice/:id/:price").post(async (req, res) => {
  _id = req.params.id;
  price = req.params.price;
  const response = await controller.postNftIdAndPrice(_id, price);
  return res.json({
    msg: response,
  });
});

router.route("/getNftIdAndPrice").get(async (req, res) => {
  // _id = req.params.id;
  // price = req.params.price;
  // nftProjectId = req.params.nftProjectId;
  try {
    let allNfts = [];
    let projectIds = [];
    let count = 0;
    const getAllNftsProjectId = await controller.getAllNftsProjectId();
    // let tmp = [];
    console.log(`heere : `, getAllNftsProjectId);

    getAllNftsProjectId.map(async (element) => {
      if (element.free !== 0) {
        console.log(element.id);
        projectIds.push(element.id);
      }
    });
    console.log(projectIds);

    // return
    // for (let i = 0; i < projectIds.length; i++) {
    //   console.log("I am in loop");
    //   const allNFTs = await controller.getAllNfts(projectIds[i]);
    //   console.log("all NFTS", allNFTs[i]?.id);
    //   await controller.getNftIdAndPrice(allNFTs[i]?.id);
    // }
    projectIds.forEach(async (element) => {
      await controller
        .getAllNfts(element)
        .then(async (result) => {
          count++;
          // await result.forEach(async (item) => {

          for (let i = 0; i < result.length; i++) {
            // item.pid = element;
            const tmp = await controller.getNftIdAndPrice(result[i].id);
            console.log(`tmp : `, tmp);
            allNfts.push(tmp);
            // console.log(`tmp : `, tmp);
            // item.price = price;
            // console.log("result ->->->: ", result);
            // });
          }
          // console.log(tmp);
          console.log("All NFTS ", allNfts);

          if (count == projectIds.length) {
            return res.json(allNfts);
          }
        })
        .catch((error) => {
          return res.json({
            error: error.message,
          });
        });
    });
  } catch (err) {
    return res.json({ err: err.message });
  }
  // const response = await controller.getNftIdAndPrice();
  // return res.json(response);
});

router.get("/get/profile/picture", tokenVerifier, controller.getProfilePicture);

router
  .route("/upload/profile/picture")
  .post(
    tokenVerifier,
    upload.single("imageUpload"),
    controller.profilePictureUpload
  );

// router
//   .route("/edit/profile/picture")
//   .put(
//     tokenVerifier,
//     upload.single("imageUpload"),
//     controller.profilePictureEdit
//   );

router.get("/logout", tokenVerifier, controller.logout);

router.put("/follow/:id", tokenVerifier, controller.follow);

router.put("/unfollow/:id", tokenVerifier, controller.unFollow);

router.get(
  "/followstatus/:artistId",
  tokenVerifier,
  controller.followUnfollowStatus
);

router.get("/followers", tokenVerifier, controller.getFollowersList);

router.get("/following", tokenVerifier, controller.getFollowingList);

router.get("/top/artists", controller.topArtists);

router.get("/listednfts/:id", tokenVerifier, controller.getListedNfts);

router.get("/getartists", tokenVerifier, controller.getArtists);

router.get("/search/artists", tokenVerifier, controller.searchArtists);

router.post(
  "/getnfts/multiple",
  tokenVerifier,
  controller.getNftsOfMultipleArtist
);

router.put("/edit/profile", tokenVerifier, controller.editProfile);

module.exports = router;
