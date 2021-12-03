const express = require("express");
const router = express.Router();
const { getProfile } = require("../Controller/profile");

router.route("/:id").get(async (req, res) => {
  const _id = req.params.id;
  console.log('id : ;============================== >>>> ', _id);
  const user = await getProfile(_id);
  console.log("USER : ===============================>>>>", user);
  return res.json({
    status: "success",
    user: user[0],
  });
});

module.exports = router;
