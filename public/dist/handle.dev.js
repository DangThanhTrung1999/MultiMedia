"use strict";

var socket = io();
var room;

function call() {
  window.open("http://www.localhost:8005/video/".concat(room), "_blank");
} // function sendName() {
//   let name = document.getElementsByName("name")[0].value;
//   socket.emit("nameSignup", name);
// }
// function sendMessage() {
//   let message = document.getElementsByName("message")[0].value;
//   socket.emit("clientSendToServer", message);
// }


function sendRoom() {
  room = document.getElementsByName("room")[0].value;
  socket.emit("serverSendRoomName", room);
  document.getElementsByName("room")[0].value = "";
}

function sendMessageInRoom() {
  var message = document.getElementsByName("messageRoom")[0].value;
  socket.emit("clientSendMessageRoomToServer", {
    message: message,
    NAME: NAME
  });
  document.getElementsByName("messageRoom")[0].value = "";
}

socket.on("sendCurrentRoomToClient", function (roomName) {
  // const login = document.getElementById("login");
  var chatRoom = document.getElementsByClassName("chatRoom")[0]; // login.style.display = "none";

  chatRoom.style.display = "flex";
  var roomCurrent = document.getElementsByClassName("listMessage__roomCurrent")[0];
  roomCurrent.innerHTML = roomName;
});
socket.on("sendListRoomToAllClient", function (listRoom) {
  document.getElementsByClassName("listRoom")[0].innerHTML = "";
  listRoom.forEach(function (e) {
    var li = document.createElement("li");
    var content = document.createTextNode(e);
    li.appendChild(content);
    document.getElementsByClassName("listRoom")[0].appendChild(li);
  });
}); ///Xử lí khi user đăng ký thất bại do trùng tên

socket.on("dktb", function () {
  document.getElementById("error").innerHTML = "Username has exist";
}); ///Lắng nghe nếu nhấp tên thành công thì show ra form chat

socket.on("dktc", function (name) {
  var login = document.getElementById("login");
  var chat = document.getElementById("chat");
  login.style.display = "none";
  chat.style.display = "flex";
}); ///Hiển thị danh sách user

socket.on("listUser", function (listUser) {
  document.getElementById("list_user").innerHTML = "";
  listUser.forEach(function (element) {
    var node = document.createElement("li");
    var textNode = document.createTextNode(element);
    node.appendChild(textNode);
    document.getElementById("list_user").appendChild(node);
  });
}); //Hiển thị danh sách tin nhắn ở chat 1 1

socket.on("serverSendToClient", function (message) {
  var node = document.createElement("li");
  var textNode = document.createTextNode(message);
  node.appendChild(textNode);
  document.getElementsByClassName("right__content")[0].appendChild(node);
}); // Hiển thị danh sách tin nhắn ở chat room

socket.on("serverSendToClientChatRoom", function (_ref) {
  var message = _ref.message,
      NAME = _ref.NAME;
  var node = document.createElement("li");
  var textNode = document.createTextNode("".concat(NAME, ": ").concat(message));
  node.appendChild(textNode);
  document.getElementsByClassName("listMessage__content")[0].appendChild(node);
});