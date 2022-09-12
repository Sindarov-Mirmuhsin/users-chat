import userSocket from './user.js'
import messageSocket from './message.js'

export default (io) => {
  io.on('connection', (socket) => {
    userSocket(io, socket)
    messageSocket(io, socket)
  })
};
