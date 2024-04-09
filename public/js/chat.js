const socket = io(); // socket io 모듈을 사용하면 socket io client도 포함돼 있어서 사용 가능하다.

const query = new URLSearchParams(location.search); // url query문 가져올 수 있다.

const username = query.get("username");
const room = query.get("room");
// 서버로 join으로 데이터를 전송한다.
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

// 유저 입장 시 템플릿
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});

// 유저 입장 시 환영메시지 템플릿
const messageTemplate = document.querySelector("#message-template").innerHTML;
const messages = document.querySelector("#messages");

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);
  scrollToBottom();
});

// 데이터가 위에 쌓이면 스코롤 올려주기
function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

// 유저가 메시지 전송하기
const messageForm = document.querySelector("#message-form");
const messageFormInput = messageForm.querySelector("input");
const messageFormButton = messageForm.querySelector("button");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault(); // 페이지가 새로고침 안되게

  messageFormButton.setAttribute("disabled", "disabled");
  // 메시지가 정상적으로 전송되지 않으면 버튼을 못 누르게

  const message = messageFormInput.value;
  // input에 치는 value?

  socket.emit("sendMessage", message, (error) => {
    messageFormButton.removeAttribute("disabled");
    // setAttribute 다시 누를 수 있게
    messageFormInput.value = "";
    messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
  });
});
