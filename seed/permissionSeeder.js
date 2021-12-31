const Permissions = require("../models/permissions");
const mongoose = require("mongoose");
const { exit } = require("process");
require("dotenv").config();
// mongoose connection
mongoose
  .connect(
    "mongodb+srv://Farzan:Mongodb@123@cluster0.gkqpe.mongodb.net/NoorNFT?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const permissions = [
  new Permissions({
    name: "create-collections",
    group: "artist",
  }),
  new Permissions({
    name: "view-collections",
    group: "artist",
  }),
  new Permissions({
    name: "delete-collections",
    group: "artist",
  }),
  new Permissions({
    name: "create-nft",
    group: "artist",
  }),
  new Permissions({
    name: "view-nft",
    group: "artist",
  }),
  new Permissions({
    name: "create-listing",
    group: "artist",
  }),
  new Permissions({
    name: "view-listing",
    group: "artist",
  }),
  new Permissions({
    name: "update-listing",
    group: "artist",
  }),
  new Permissions({
    name: "create-featured",
    group: "artist",
  }),
  new Permissions({
    name: "view-featured",
    group: "artist",
  }),
  new Permissions({
    name: "view-featured",
    group: "admin",
  }),
  new Permissions({
    name: "create-featured",
    group: "admin",
  }),
];

var done = 0;
for (var i = 0; i < permissions.length; i++) {
  permissions[i].save((err, result) => {
    done++;
    if (done === permissions.length) {
      mongoose.disconnect();
    }
  });
}
