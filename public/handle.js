const socket = io();
let room;
function call() {
  window.open(`http://localhost:8005/video/${room}`, "_blank");
}
// https://multi-media.herokuapp.com/video/${room}
// http://localhost:8005/video/${room}
function sendName() {
  socket.emit("sendNametoServer", NAME);
}

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

document
  .getElementsByClassName("input-message")[0]
  .addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      sendMessageInRoom();
    }
  });
socket.on("sendCurrentRoomToClient", (roomName) => {
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
  if (NAME === Cookies.get().name) {
    node.classList.add("myClass");
  } else {
    node.classList.add("otherClass");
  }
  let textNode = document.createTextNode(`${NAME}: ${message}`);
  node.appendChild(textNode);
  document.getElementsByClassName("listMessage__content")[0].appendChild(node);
});
