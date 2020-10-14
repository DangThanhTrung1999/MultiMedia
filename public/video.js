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
myVideo.muted = true;
const peers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    ///answer
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (remoteStream) => {
        addVideoStream(video, remoteStream);
      });
    });

    ///call
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

//call
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (localStream) => {
    addVideoStream(video, localStream);
  });
  call.on("close", () => {
    video.remove();
  });
}

async function addVideoStream(video, stream) {
  video.srcObject = stream;
  await video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  await videoGrid.append(video);
}
