import { Router } from 'express'
import ProductController from '../controllers/productController'

const productRouter = Router()

productRouter.post('/', ProductController.create)
productRouter.get('/', ProductController.getAll)
productRouter.get('/:id', ProductController.getOne)
productRouter.post('/addImg', ProductController.addImg)
productRouter.post('/updateRemainder', ProductController.updateRemainder)

export default productRouter