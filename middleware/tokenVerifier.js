const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const bCrypt = require("bcryptjs");

// module.exports = function (req, res, next) {
//   // Get token from header
//   const token = req.header('token');

//   // Check if not token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     jwt.verify(token, 'jwtSecret', (error, decoded) => {
//       if (error) {
//         return res.status(401).json({ msg: 'Token is not valid' });
//       } else {
//         req.user = decoded.user;
//         next();
//       }
//     });
//   } catch (err) {
//     console.error('something wrong with auth middleware');
//     res.status(500).json({ msg: 'Server Error' });
//   }
// };

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
