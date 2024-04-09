// 방에 입장할 유저 로직 // 서버 socket io 로직에서 사용
const addUser = ({ id, username, room }) => {
  // db연결 시 db에서 찾아야됨
  const users = [];

  username = username.trim();
  room = room.trim();

  if (!username || !room) {
    return {
      error: "사용자 이름과 방이 필요합니다.",
    };
  }
  // 방에 있는 유저
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "사용자 이름이 사용 중입니다.",
    };
  }

  const user = { id, username, room };
  users.push(user);

  return { user };
};

module.exports = {
  addUser,
};
