import { Router } from 'express'
import OrderController from '../controllers/orderController'
import { verifyToken } from '../middlewars/authMiddleware'

const orderRouter = Router()

orderRouter.post('/', verifyToken, OrderController.createOrder)

export default orderRouter