const express = require("express");

const app = express();
const path = require("path");

// express 서버와 socketio 서버를 연동하려면 http에 express 넣어야함
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { generateMessage } = require("./utils/messages");
const {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
} = require("./utils/users");
const io = new Server(server);

// io가 connection이 일어나면 socket을 받아온다.
io.on("connection", (socket) => {
  // 클라이언트에서 join으로 데이터를 받아온다.
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }

    socket.join(user.room); // 방이 socket에 진입한다.

    socket.emit(
      "message",
      generateMessage("Admin", `${user.room}방에 오신 걸 환영합니다.`)
    ); // 나에게 보냄
    socket.broadcast // 나를 제외한 방에 있는 유저에게 보냄
      .to(user.room)
      .emit("message", generateMessage("", `${user.username}가 참여했습니다.`));

    // 모든 사람들에게 보내준다.
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    // users 배열에 socket에 유저 정보가 담겨져있다.
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, message));

    // chat.js socket.emit부분 호출
    callback();
  });

  // 서버에서 꺼지면 함수 실행
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    // 만약 유저가 있다면 방을 나간 걸 보여주고 users의 정보를 새로고침해준다.
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username}가 방을 나갔습니다.`),
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        })
      );
    }
  });
});

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const port = 3000;

server.listen(port, () => {
  console.log(`server open ${port}`);
});
