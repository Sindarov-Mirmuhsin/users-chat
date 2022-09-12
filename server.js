import express from "express";
import fileUpload from "express-fileupload";
import path from 'path'
import ejs from 'ejs'
import { createServer } from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3000

const app = express();

import userRouter from './router/user.router.js'
import messageRouter from "./router/message.router.js";
import socketModule from './socket/index.js'

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static(path.resolve(process.cwd(), 'public')))
app.use(express.static(path.resolve(process.cwd(), "uploads")));


app.use(express.json())
app.use(fileUpload())

app.use(userRouter)
app.use(messageRouter);


const httpServer = createServer(app);
const io = new Server(httpServer);
socketModule(io)


httpServer.listen(PORT, () =>
	console.log('server ready at http://localhost:3000'),
);