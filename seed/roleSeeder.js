const Roles = require("../models/roles");
const mongoose = require("mongoose");
const Permissions = require("../models/permissions");
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

Permissions.find()
  .exec()
  .then((result) => {
    // console.log(result);
    const roles = [
      new Roles({
        name: "collector",
        permission: [],
      }),
      new Roles({
        name: "artist",
        permission: [result[0]._id, result[1]._id, result[2]._id],
      }),
    ];
    var done = 0;
    for (var i = 0; i < roles.length; i++) {
      roles[i].save((err, result) => {
        done++;
        if (done === roles.length) {
          mongoose.disconnect();
        }
      });
    }
  })
  .catch((error) => {
    console.log(`couldn't fetch`);
  });
