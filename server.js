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
const listing = require("./routes/listing");
const featuredPrices = require("./routes/featuredPrices");
const generalSearching = require("./routes/generalSearching");


// Database connection
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

// for CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Init Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* Farzan */

app.use("/", auth);
app.use("/admin", admin);
app.use("/users", users);
app.use("/wallet", wallet);
app.use("/collections", collections);
app.use("/nft", nft);
app.use("/listing", listing);
app.use("/featured", featuredNfts);
app.use("/featuredprices", featuredPrices);
app.use("/search", generalSearching);

/* Farzan */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT} and Domain is ${os.hostname()}`)
);
