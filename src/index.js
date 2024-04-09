const express = require("express");

const app = express();
const path = require("path");

// express 서버와 socketio 서버를 연동하려면 http에 express 넣어야함
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// io가 connection이 일어나면 socket을 받아온다.
io.on("connection", (socket) => {
  console.log("socket", socket.id);

  // 클라이언트에서 join으로 데이터를 받아온다.
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }

    socket.join(user.room); // 방이 socket에 진입한다.
  });
  socket.on("sendMessage", () => {});
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
});

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const port = 3000;

server.listen(port, () => {
  console.log(`server open ${port}`);
});
