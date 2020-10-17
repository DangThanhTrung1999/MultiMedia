const socket = io();
let room;
function call() {
  window.open(`http://www.localhost:8005/video/${room}`, "_blank");
}

// function sendName() {
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
  let message = document.getElementsByName("messageRoom")[0].value;
  socket.emit("clientSendMessageRoomToServer", { message, NAME });
  document.getElementsByName("messageRoom")[0].value = "";
}

socket.on("sendCurrentRoomToClient", (roomName) => {
  // const login = document.getElementById("login");
  const chatRoom = document.getElementsByClassName("chatRoom")[0];
  // login.style.display = "none";
  chatRoom.style.display = "flex";

  const roomCurrent = document.getElementsByClassName(
    "listMessage__roomCurrent"
  )[0];
  roomCurrent.innerHTML = roomName;
});

socket.on("sendListRoomToAllClient", (listRoom) => {
  document.getElementsByClassName("listRoom")[0].innerHTML = "";
  listRoom.forEach((e) => {
    let li = document.createElement("li");
    let content = document.createTextNode(e);
    li.appendChild(content);
    document.getElementsByClassName("listRoom")[0].appendChild(li);
  });
});
///Xử lí khi user đăng ký thất bại do trùng tên
socket.on("dktb", () => {
  document.getElementById("error").innerHTML = "Username has exist";
});
///Lắng nghe nếu nhấp tên thành công thì show ra form chat
socket.on("dktc", (name) => {
  const login = document.getElementById("login");
  const chat = document.getElementById("chat");
  login.style.display = "none";
  chat.style.display = "flex";
});
///Hiển thị danh sách user
socket.on("listUser", (listUser) => {
  document.getElementById("list_user").innerHTML = "";
  listUser.forEach((element) => {
    let node = document.createElement("li");
    let textNode = document.createTextNode(element);
    node.appendChild(textNode);
    document.getElementById("list_user").appendChild(node);
  });
});
//Hiển thị danh sách tin nhắn ở chat 1 1
socket.on("serverSendToClient", (message) => {
  let node = document.createElement("li");
  let textNode = document.createTextNode(message);
  node.appendChild(textNode);
  document.getElementsByClassName("right__content")[0].appendChild(node);
});
// Hiển thị danh sách tin nhắn ở chat room
socket.on("serverSendToClientChatRoom", ({ message, NAME }) => {
  let node = document.createElement("li");
  let textNode = document.createTextNode(`${NAME}: ${message}`);
  node.appendChild(textNode);
  document.getElementsByClassName("listMessage__content")[0].appendChild(node);
});
