const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const users = require("./routes/users");
const admin = require("./routes/admin");
const auth = require("./routes/auth");
const background = require("./routes/BackgroundImages");
const bodyparser = require("body-parser");
require("dotenv").config();
const os = require("os");
const wallet = require("./routes/wallet");
const collections = require("./routes/collections");
const nft = require("./routes/nft");
const featuredNfts = require("./routes/featurednfts");
const listing = require('./routes/listing')

// for CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  next();
});

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
global.__basedir = __dirname;

app.use(express.static(path.join(__dirname, "uploads")));

const evokeRoutes = require("./routes/upload.route");
app.use(
  express.urlencoded({
    extended: true,
  })
);

evokeRoutes(app);
background(app);
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
// Connect Database

// Init Middleware
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent// to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middlewarenext();
//   next();
// });

// app.use(
//   cors({
//     origin: "https://noor-nft-admin-side.herokuapp.com/",
//   })
// );

// Define Routes

/* Farzan */
app.use("/", auth);
app.use("/admin", admin);
app.use("/users", users);
app.use("/wallet", wallet);
app.use("/collections", collections);
app.use("/nft", nft);
app.use('/listing', listing)
app.use("/featured", featuredNfts);

/* Farzan */

// app.use("/api/auth", auth);
// app.use("/api/auth", auth);
// app.use("/api/bids", bids);
// app.use("/api/search", searchBar);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT} and Domain is ${os.hostname()}`)
);
