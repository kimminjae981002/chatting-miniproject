// 유저 네임을 받고 무엇이라 할지 방이 들어간 시간
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
};
