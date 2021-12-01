const express = require("express");
const { upload } = require("../Controller/api");
const router = express.Router();

router.route("/uploadnft/").get(async (req, res) => {
  const data = req.body;
  const value = await upload(data);
  res.send(value);
});

module.exports = router;
