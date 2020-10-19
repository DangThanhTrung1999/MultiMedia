const socket = io("/");
const videoGrid = document.getElementById("video-grid");
// const myPeer = new Peer(undefined, {
//   host: "/",
//   port: "3001",
// });
const myPeer = new Peer(undefined, {
  host: "peerjs-server.herokuapp.com",
  secure: true,
  port: 443,
});
const myVideo = document.createElement("video");
const videoTag = document.createElement("div");
let textNode = document.createTextNode(Cookies.get().name);
videoTag.appendChild(textNode);
videoTag.appendChild(myVideo);
const peers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(videoTag, myVideo, stream);
    ///answer
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      const videoTag = document.createElement("div");
      let textNode = document.createTextNode(Cookies.get().name);
      videoTag.appendChild(textNode);
      videoTag.appendChild(video);
      call.on("stream", (remoteStream) => {
        addVideoStream(videoTag, video, remoteStream);
      });
    });

    ///call
    socket.on("user-connected", (data) => {
      connectToNewUser(data, stream);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, Cookies.get().name);
});

//call
function connectToNewUser(data, stream) {
  const call = myPeer.call(data.userId, stream);
  const video = document.createElement("video");
  const videoTag = document.createElement("div");
  let textNode = document.createTextNode(data.name);
  videoTag.appendChild(textNode);
  videoTag.appendChild(video);
  call.on("stream", (localStream) => {
    addVideoStream(videoTag, video, localStream);
  });
  call.on("close", () => {
    video.remove();
  });
}

async function addVideoStream(videoTag, video, stream) {
  video.srcObject = stream;
  await video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  await videoGrid.append(videoTag);
}
