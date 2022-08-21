import { Router } from 'express'
import ProductController from '../controllers/productController'

const productRouter = Router()

productRouter.post('/', ProductController.create)
productRouter.get('/', ProductController.getAll)
productRouter.get('/:id', ProductController.getOne)

export default productRouter