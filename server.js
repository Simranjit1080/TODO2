var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/Todo",
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("mongo connected");
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);
var db = mongoose.connection;
var Tasks = db.collection("Tasks");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get('/getList', (req, res) => {
  Tasks.find({}).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
             res.send(result);
           });
});

app.post('/addTask', (req, res) => {
  if (req.query.caption == "") {
    console.log("asd");
        res.status(406).json({ errMsg: "input field can't be left Empty" });
    }
    else {
        var data = {
    caption: req.query.caption,
    isComplete: false
  };
  db.collection("Tasks").insertOne(data, function (err) {
    if (err) {
      console.log("Task not added");
    } else {
      console.log("Task added");
    }
  })
    }
});

app.get("/toggle", function (req, res) {
  var i = req.query.id;
  let task = db
    .collection("Tasks")
    .findOne({ _id: ObjectId(i) })
    .then((task) => {
      db.collection("Tasks")
        .updateOne(
          {
            _id: ObjectId(i),
          },
          {
            $set: { isComplete: !task.isComplete },
          }
        )
        .then(() => {
          res.status(200).json({ msg: "toggle" });
        })
    })
});

app.get("/delete", function (req, res) {
  var i = req.query.id;
  var f = req.query.f;
  db.collection("Tasks").deleteOne({
    _id: ObjectId(i),
  }).then(() => {
          res.status(200).json({ msg: "delete" });
        })
        .catch((err) => res.status(409).json({ errMsg: err }));
    });

app.get('/', (req, res) => {
    res.redirect("index.html");
});

app.listen(4000, function () {
  console.log("server is running on port 4000");
});