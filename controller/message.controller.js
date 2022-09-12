import { read, write } from "../utils/model.js";

const GET = (req, res) => {
  try {
      let messages = read('messages')
      let users = read("users");
      users = users.filter((user) => delete user.password);
      
      let { userId } = req.query
      
      messages = messages.filter(message => 
        (message.to == userId && message.from == req.userId) ||
          (message.to == req.userId && message.from == userId)
      )

      messages = messages.map(message => {
        message.to = users.find(user => user.userId == message.to)
        message.from = users.find(user => user.userId == message.from)
        return message
      })

      return res.status(200).json({ status: 200, message: "ok", data: messages});
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};


export default {
    GET
}