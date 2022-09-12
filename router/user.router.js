import { Router } from 'express'
import userController from '../controller/user.controller.js'

const router = Router()

router.post("/login", userController.LOGIN);
router.post("/register", userController.REGISTER);
router.get('/users', userController.GET)
router.get("/users/:token", userController.GET);

router.get("/", userController.GET_HOME);
router.get("/login", userController.GET_LOGIN);
router.get("/register",userController.GET_REGISTER);



export default router