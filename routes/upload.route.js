const express = require("express");
const router = express.Router();

const controller = require("../Controller/fileUpload.controller");

let routes = (app) => {
  router.post("/upload-file", controller.uploadFile);

  router.get("/files", controller.getFilesList);

  router.get("/files/:name", controller.downloadFiles);

  router.get("/file/:tokenId", controller.getImageById);
  router.put("/file/:id", controller.changeOwner);

  router.delete("/delete/:tokenId", controller.deleteImage);
  router.post("/addtag", controller.addTag);
  app.use(router);
};

module.exports = routes;
