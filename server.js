const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const users = require("./routes/users");
const bids = require("./routes/bids");
const auth = require("./routes/auth");
const searchBar = require("./routes/searchBar");
const upload = require("./routes/upload.route.js");
const background = require("./routes/BackgroundImages");
const bodyparser = require("body-parser");
require("dotenv").config();
const os = require("os");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
global.__basedir = __dirname;

app.use(express.static(path.join(__dirname, "public")));

const evokeRoutes = require("./routes/upload.route");
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

evokeRoutes(app);
background(app);
mongoose
  .connect(
    "mongodb+srv://KhizerHameed98:KhizerHameed98@cluster0.yb8jq.mongodb.net/NFT?retryWrites=true&w=majority",
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
// app.use(express.json());

// Define Routes
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/auth", auth);
app.use("/api/bids", bids);
app.use("/api/search", searchBar);

const PORT = 500;

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server started on port ${PORT} and Domain is ${os.hostname()}`)
);
