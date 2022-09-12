import jwt from "../utils/jwt.js";
import { read, write } from "../utils/model.js";

export default (io, socket) => {
  let token = socket.handshake.auth.token;
  try {
    if (!token) {
      socket.emit("exit");
    }

    let { userId } = jwt.verify(token);

    let users = read("users");
    let user = users.find((user) => user.userId == userId);
    user.socketId = socket.id;
    write("users", users);

    socket.broadcast.emit("user-connect", userId);
    socket.userId = userId
    socket.on("disconnect", () => {
      let user = users.find((user) => user.userId == userId);
      user.socketId = null;
      write("users", users);
      socket.broadcast.emit("user-disconnect", userId);
    });
  } catch (error) {
    socket.emit("exit");
  }
};
