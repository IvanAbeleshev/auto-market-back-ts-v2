import { Router } from 'express'
import OrderController from '../controllers/orderController'

const orderRouter = Router()

orderRouter.post('/', OrderController.createOrder)

export default orderRouter