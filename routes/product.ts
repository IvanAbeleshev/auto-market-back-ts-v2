import { Router } from 'express'
import ProductController from '../controllers/productController'

const productRouter = Router()

//get methods
productRouter.get('/', ProductController.getAll)
productRouter.get('/mostPopular/', ProductController.getMostPopularProductByTypes)
productRouter.get('/:id', ProductController.getOne)

//post methods
productRouter.post('/', ProductController.create)
productRouter.post('/:id/addImg', ProductController.addImg)
productRouter.post('/:id/updateRemainder', ProductController.updateRemainderProduct)
productRouter.post('/updateRemainder', ProductController.updateRemainder)


export default productRouter