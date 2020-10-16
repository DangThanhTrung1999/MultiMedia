const express = require("express");
const app = express();
app.use(express.static("./public"));
const port = process.env.PORT || 8005;

const mongoClient = require("mongoose");
const bodyParser = require("body-parser");

const { v4: uuidV4 } = require("uuid");

var session = require("express-session");
app.use(
  session({ secret: "mySecret", resave: false, saveUninitialized: false })
);

app.set("view engine", "ejs");
app.set("views", "./views");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoClient
  .connect("mongodb://localhost:27017/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect db ok"))
  .catch((e) => console.log("Connect db have error ", e));
const userRoute = require("./routes/user.route");

///socket io
const server = require("http").Server(app);
const io = require("socket.io")(server);
const userArray = [];
const arrRoom = [];

io.on("connection", (socket) => {
  console.log("Have user connect " + socket.id);
  ///Chat 1 1
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
  socket.on("serverSendRoomName", (roomName) => {
    socket.join(roomName);
    socket.Phong = roomName;

    if (arrRoom.indexOf(roomName) < 0) {
      arrRoom.push(roomName);
    }
    io.sockets.emit("sendListRoomToAllClient", arrRoom);
    socket.emit("sendCurrentRoomToClient", roomName);
  });
  ///Chat room
  socket.on("clientSendMessageRoomToServer", ({ message, NAME }) => {
    io.sockets
      .in(socket.Phong)
      .emit("serverSendToClientChatRoom", { message, NAME });
  });

  ///video chat
  socket.on("join-room", (roomId, userId) => {
    // console.log(roomId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.redirect("/user/login");
});

app.get("/home", (req, res) => {
  return res.render("trangchu", {
    name: req.session.name,
  });
});
app.get("/video", (req, res) => {
  res.redirect(`/video/${uuidV4()}`);
});
app.get("/video/:room", (req, res) => {
  res.render("video", { roomId: req.params.room });
});
app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

server.listen(port, () => console.log(`Server run on port ${port}`));
