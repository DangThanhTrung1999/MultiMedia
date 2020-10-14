const express = require("express");
const app = express();
app.use(express.static("./public"));
const port = process.env.PORT ||8005;
const { v4: uuidV4 } = require("uuid");
app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);
const userArray = [];
const arrRoom = [];

io.on("connection", (socket) => {
  console.log("Have user connect " + socket.id);
  ///Chat 1 1
  socket.on("nameSignup", (name) => {
    if (userArray.indexOf(name) >= 0) {
      socket.emit("dktb");
    } else {
      userArray.push(name);
      socket.userName = name;
      socket.emit("dktc", name);
      io.sockets.emit("listUser", userArray);
    }
  });
  socket.on("clientSendToServer", (message) => {
    io.sockets.emit("serverSendToClient", message);
  });
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
  socket.on("clientSendMessageRoomToServer", (message) => {
    io.sockets.in(socket.Phong).emit("serverSendToClientChatRoom", {
      id: socket.id,
      message,
    });
  });

  ///video chat
  socket.on('join-room', (roomId, userId) => {
    // console.log(roomId);
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
});
app.get("/", (req, res) => {
  res.render("trangchu");
});
app.get("/video", (req, res) => {
  res.redirect(`/video/${uuidV4()}`);
});
app.get("/video/:room", (req, res) => {
  res.render("video", { roomId: req.params.room });
});

server.listen(port, () => console.log(`Server run on port ${port}`));
