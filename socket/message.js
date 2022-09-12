import jwt from "../utils/jwt.js";
import { read, write } from "../utils/model.js";

export default (io, socket) => {
  try {
    socket.on('new-message', ({to, text}) => {
        let users = read('users')
        let messages = read('messages')

        let newMessage = {
            messageId: messages.length ? messages.at(-1)?.messageId + 1 : 1,
            from: socket.userId, to, text, created_at: "13:00"
        }

        messages.push(newMessage)
        write('messages', messages)

        newMessage.to = users.find(user => user.userId == to)
        newMessage.from = users.find((user) => user.userId == socket.userId);
        
        io.to(newMessage.to.socketId).emit('send-message', newMessage)
    })

    socket.on('typing', ({to}) => {
        let users = read("users");
        let user = users.find(user => user.userId == to)
        io.to(user.socketId).emit("typing");
    })

    socket.on("stop", ({ to }) => {
      let users = read("users");
      let user = users.find((user) => user.userId == to);
      io.to(user.socketId).emit("stop");
    });

  } catch (error) {
    console.log(error);
  }
};
