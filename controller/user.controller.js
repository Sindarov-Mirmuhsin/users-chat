import { read, write } from '../utils/model.js'
import path from 'path'
import jwt from '../utils/jwt.js'



const LOGIN = (req, res) => {
    try {
        let users = read('users')
        let { username, password } = req.body

        let user = users.find(user => user.username == username && user.password == password)

        if(!user){
            throw new Error('wrong username or password')
        }

        return res.status(200).json({
            status: 200,
            message: "ok",
            data: user,
            token: jwt.sign({userId: user.userId})
        })

    } catch (error) {
        res.status(400).json({status: 400, message: error.message})
    }
}



const REGISTER = (req, res) => {
  try {
    let users = read("users");
    let { username, password } = req.body;
    let { file } = req.files

    

    let user = users.find((user) => user.username == username );

    if (user) {
      throw new Error("this username exists");
    }

    let fileName = Date.now() + file.name.replace(/\s/g, "");
    file.mv(path.join(process.cwd(), "uploads", fileName));

    let newUser = {
        userId: users.length ? users.at(-1)?.userId + 1 : 1,
        username, password, avatar: fileName
    }
    users.push(newUser)
    write('users', users)

    return res.status(201).json({
      status: 201,
      message: "created",
      data: newUser,
      token: jwt.sign({ userId: newUser.userId }),
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

const GET = ( req, res) => {
  try {
    let users = read('users')
    users = users.filter(user => delete user.password)

    let { token } = req.params

    if(token){
      let { userId } = jwt.verify(token)
      return res.status(200).json({ status: 200, message: "ok", data: users.find(user => user.userId == userId) });
    }else{
      return res.status(200).json({ status: 200, message: "ok", data: users });
    }

  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
}



const GET_LOGIN = (_, res) => {
  try {
    res.render('login')
  } catch (error) {
    
  }
}
const GET_REGISTER = (_, res) => {
  try {
    res.render('register')
  } catch (error) {
    
  }
};

const GET_HOME = (_, res) => {
  try {
    res.render('index')
  } catch (error) {
    
  }
};


export default {
  LOGIN,
  REGISTER,
  GET,
  GET_LOGIN,
  GET_REGISTER,
  GET_HOME
};