const express = require("express");
const app = express();
app.use(express.static("./public"));
const port = process.env.PORT || 8005;
require("dotenv").config();
const mongoClient = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

app.use(cookieParser());

const { v4: uuidV4 } = require("uuid");

var session = require("express-session");
app.use(
  session({ secret: "mySecret", resave: false, saveUninitialized: false })
);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// "mongodb://localhost:27017/chat"

mongoClient
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect db ok"))
  .catch((e) => console.log("Connect db have error ", e));
const userRoute = require("./routes/user.route");

///socket io
const server = require("http").Server(app);
const io = require("socket.io")(server);
const arrRoom = [];
const arrUser = [];

io.on("connection", (socket) => {
  console.log("Have user connect " + socket.id);
  let nameUser;
  ///Chat room
  socket.on("sendNametoServer", (name) => {
    if (arrUser.indexOf(name) < 0) {
      nameUser = name;
      arrUser.push(name);
    }
  });
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
  socket.on("join-room", (roomId, userId, name) => {
    console.log("name join room ", name);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", {
      userId,
      name,
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
      const index = arrUser.indexOf(name);
      if (index > -1) {
        arrUser.splice(index, 1);
      }
    });
  });
});

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.redirect("/user/login");
});
const authMiddleware = require("./auth.middleware");

app.get("/home", (req, res, next) => {
  authMiddleware.requireAuth(req, res, next);
  return res.render("trangchu", {
    name: req.session.name,
  });
});
app.get("/video", (req, res, next) => {
  authMiddleware.requireAuth(req, res, next);
  res.redirect(`/video/${uuidV4()}`);
});
app.get("/video/:room", (req, res, next) => {
  authMiddleware.requireAuth(req, res, next);
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
