import { Router } from 'express'
import { validate } from 'express-validation'
import UserController from '../controllers/userController'
import { verifyToken } from '../middlewars/authMiddleware'
const userRouter = Router()

userRouter.post('/registration', validate(UserController.VIRequest),UserController.registration)
userRouter.post('/login', validate(UserController.VIRequest), UserController.login)
userRouter.get('/check', verifyToken, UserController.checkUser)

export default userRouter