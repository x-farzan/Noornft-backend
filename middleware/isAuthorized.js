const User = require("../models/User");
const Roles = require("../models/roles");
const Permissions = require("../models/permissions");
require("dotenv").config();

exports.isAuthorized = (req, res, next) => {
  const reqType = req.method;
  let baseUrl = req.baseUrl;
  console.log(`base-url: `, baseUrl);
  baseUrl = baseUrl.substr(1);
  var str = undefined;
  var perm = [];

  switch (reqType) {
    case "GET":
      str = `view-${baseUrl}`;
      break;
    case "POST":
      str = `create-${baseUrl}`;
      break;
    case "PUT":
      str = `update-${baseUrl}`;
      break;
    case "DELETE":
      str = `delete-${baseUrl}`;
      break;
    default:
      return res.json({
        message: `Invalid request type`,
      });
  }

  //FINDING USER
  User.find({ email: req.userData.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Email not found.",
        });
      }
      console.log(user[0]);
      const role_id = user[0].role;
      //FINDING ROLES
      Roles.find({ name: role_id })
        .exec()
        .then((role) => {
          if (role.length < 1) {
            return res.status(401).json({
              message: "role not found.",
            });
          }
          const permissions = role[0].permission;

          if (permissions.length == 0) {
            return res.status(401).json({
              message: "permissions not found.",
            });
          }

          for (var i = 0; i < permissions.length; i++) {
            Permissions.find({ _id: permissions[i] })
              .exec()
              .then((result) => {
                if (result.length < 1) {
                  return res.status(401).json({
                    message: "permissions not found.",
                  });
                }
                // GETTING PERMISSION NAMES
                //console.log(result);
                perm.push(result);
                if (perm.length === permissions.length) {
                  req.perm = {
                    str: str,
                    perm: perm,
                  };
                  console.log(`here : `, req.perm.perm);
                  console.log(`on next`);
                  next();
                }
              })
              .catch((err) => {
                console.log("ERROR", err);
                return res.status(500).json({
                  error: err,
                });
              });
          }
        })
        .catch((err) => {
          console.log("ERROR", err);
          return res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log("ERROR", err);
      return res.status(500).json({
        error: err,
      });
    });
};
