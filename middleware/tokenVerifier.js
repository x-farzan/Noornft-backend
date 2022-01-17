const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const bCrypt = require("bcryptjs");

exports.tokenVerifier = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, auth) => {
      if (auth) {
        //console.log(auth);
        req.userData = auth;
        next();
      } else {
        res.send("Token Expired");
      }
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
