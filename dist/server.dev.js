"use strict";

var express = require("express");

var app = express();
app.use(express["static"]("./public"));
var port = process.env.PORT || 8005;

require("dotenv").config();

var mongoClient = require("mongoose");

var bodyParser = require("body-parser");

var _require = require("uuid"),
    uuidV4 = _require.v4;

var session = require("express-session");

app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: false
}));
app.set("view engine", "ejs");
app.set("views", "./views"); // parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/json

app.use(bodyParser.json()); // "mongodb://localhost:27017/chat"

mongoClient.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("Connect db ok");
})["catch"](function (e) {
  return console.log("Connect db have error ", e);
});

var userRoute = require("./routes/user.route"); ///socket io


var server = require("http").Server(app);

var io = require("socket.io")(server);

var userArray = [];
var arrRoom = [];
io.on("connection", function (socket) {
  console.log("Have user connect " + socket.id); ///Chat 1 1
  // socket.on("nameSignup", (name) => {
  //   if (userArray.indexOf(name) >= 0) {
  //     socket.emit("dktb");
  //   } else {
  //     userArray.push(name);
  //     socket.userName = name;
  //     socket.emit("dktc", name);
  //     io.sockets.emit("listUser", userArray);
  //   }
  // });
  // socket.on("clientSendToServer", (message) => {
  //   io.sockets.emit("serverSendToClient", message);
  // });
  ///Chat room

  socket.on("serverSendRoomName", function (roomName) {
    socket.join(roomName);
    socket.Phong = roomName;

    if (arrRoom.indexOf(roomName) < 0) {
      arrRoom.push(roomName);
    }

    io.sockets.emit("sendListRoomToAllClient", arrRoom);
    socket.emit("sendCurrentRoomToClient", roomName);
  }); ///Chat room

  socket.on("clientSendMessageRoomToServer", function (_ref) {
    var message = _ref.message,
        NAME = _ref.NAME;
    io.sockets["in"](socket.Phong).emit("serverSendToClientChatRoom", {
      message: message,
      NAME: NAME
    });
  }); ///video chat

  socket.on("join-room", function (roomId, userId) {
    // console.log(roomId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("disconnect", function () {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
app.use("/user", userRoute);
app.get("/", function (req, res) {
  res.redirect("/user/login");
});
app.get("/home", function (req, res) {
  return res.render("trangchu", {
    name: req.session.name
  });
});
app.get("/video", function (req, res) {
  res.redirect("/video/".concat(uuidV4()));
});
app.get("/video/:room", function (req, res) {
  res.render("video", {
    roomId: req.params.room
  });
});
app.use(function (req, res, next) {
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  var error = app.get("env") === "development" ? err : {};
  var status = err.status || 500;
  res.status(status).json({
    error: {
      message: error.message
    }
  });
});
server.listen(port, function () {
  return console.log("Server run on port ".concat(port));
});