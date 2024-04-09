const express = require("express");

const app = express();

// express 서버와 socketio 서버를 연동하려면 http에 express 넣어야함
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../public")));

const port = 3000;

app.listen(port, () => {
  console.log(`server open ${port}`);
});
