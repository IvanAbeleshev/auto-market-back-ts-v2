import { Router } from 'express'
import ProductController from '../controllers/productController'
import { checkRole } from '../middlewars/checkRole'

const productRouter = Router()

//get methods
productRouter.get('/', ProductController.getAll)
productRouter.get('/mostPopular/', ProductController.getMostPopularProductByTypes)
productRouter.get('/:id', ProductController.getOne)

//post methods
productRouter.post('/',  checkRole, ProductController.create)
productRouter.post('/:id/addImg', checkRole, ProductController.addImg)
productRouter.post('/:id/updateRemainder', checkRole, ProductController.updateRemainderProduct)
productRouter.post('/updateRemainder', checkRole, ProductController.updateRemainder)


export default productRouter