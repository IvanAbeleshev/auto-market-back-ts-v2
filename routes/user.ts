import { Router } from 'express'
import { validate } from 'express-validation'
import UserController from '../controllers/userController'
const userRouter = Router()

userRouter.post('/registration', validate(UserController.VIRequest),UserController.registration)
userRouter.post('/login', validate(UserController.VIRequest), UserController.login)

export default userRouter