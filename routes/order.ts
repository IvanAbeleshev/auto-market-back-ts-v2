import { Router } from 'express'
import { validate } from 'express-validation'
import OrderController from '../controllers/orderController'
import { verifyToken } from '../middlewars/authMiddleware'

const orderRouter = Router()

orderRouter.post('/', [verifyToken, validate(OrderController.VIRequestOrder)], OrderController.createOrder)

export default orderRouter