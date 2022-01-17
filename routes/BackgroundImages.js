const express = require("express");
const router = express.Router();

const controller = require("../Controller/backGrounImages");

let routes = (app) => {
  router.post("/background/imageUpload", controller.firstImageUpload);

  router.post("/background/image1", controller.imageOneUpdation);
  router.post("/background/image2", controller.imageTwoUpdation);
  router.post("/background/image3", controller.imageThreeUpdation);
  router.get("/all/background/images", controller.getBackgroundImages);

  app.use(router);
};

module.exports = routes;
