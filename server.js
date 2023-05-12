require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Not connected to database");
  });

const WishSchema = new mongoose.Schema({
  userID: String,
  userName: String,
  wish: String,
});

const Wish = new mongoose.model("wish", WishSchema);

app.get("/", (req, res) => {
  res.json("Hello");
});

app.post("/wish", (req, res) => {
  //   console.log("Ready to Wish");
  const userName = req.body.userName;
  const wish = req.body.wish;

  const newWish = new Wish({
    userName: userName,
    wish: wish,
  });

  newWish.save();

  res.json("OK");
});

app.post("/get-wishes", (req, res) => {
  //   Wish.find({}, (err, wishes) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.json({ wishes });
  //   });
  Wish.find({})
    .then((wishes) => {
      //   console.log(wishes.length);
      res.json({ wishes });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Server is running.");
});
