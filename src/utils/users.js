// db연결 시 db에서 찾아야됨
const users = [];

// 방에 입장할 유저 로직 // 서버 socket io 로직에서 사용

const addUser = ({ id, username, room }) => {
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

// 같은 방에 있는 유저 찾는 로직
const getUsersInRoom = (room) => {
  room = room.trim();

  return users.filter((user) => user.room === room);
};

// user 찾기
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// 유저 나갈 때 방에서 삭제
const removeUser = (id) => {
  // 지우려고 하는 유저가 있는지 찾기
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  // 만약 있다면 지운다.
  if (index !== -1) {
    // [0]을 하면 지워진 정보가 return 된다.
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
};
