const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const users = require("./routes/users");
const admin = require("./routes/admin");
const bids = require("./routes/bids");
const auth = require("./routes/auth");
const searchBar = require("./routes/searchBar");
const upload = require("./routes/upload.route.js");
const background = require("./routes/BackgroundImages");
const bodyparser = require("body-parser");
const api = require("./routes/api");
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

// Define Routes

/* Farzan */
app.use("/", auth);
app.use("/admin", admin);
app.use("/users", users);
app.use("/api", api);
/* Farzan */

// app.use("/api/auth", auth);
// app.use("/api/auth", auth);
// app.use("/api/bids", bids);
// app.use("/api/search", searchBar);

const PORT = 8080;

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server started on port ${PORT} and Domain is ${os.hostname()}`)
);
