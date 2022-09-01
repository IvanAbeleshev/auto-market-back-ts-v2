import { Router } from 'express'
import { validate } from 'express-validation'
import ProductController from '../controllers/productController'
import { checkRole } from '../middlewars/checkRole'

const productRouter = Router()

//get methods
productRouter.get('/', validate(ProductController.VIRequestGetAll), ProductController.getAll)
productRouter.get('/mostPopular/', validate(ProductController.VIRequestMostPopular), ProductController.getMostPopularProductByTypes)
productRouter.get('/:id', validate(ProductController.VIRequestGetOne), ProductController.getOne)

//post methods
productRouter.post('/',  [checkRole, validate(ProductController.VIRequestCreate)], ProductController.create)
productRouter.post('/:id/addImg', [checkRole, validate(ProductController.VIRequestGetOne)], ProductController.addImg)
productRouter.post('/:id/updateRemainder', [checkRole, validate(ProductController.VIRequestUpdateRemainderProduct)], ProductController.updateRemainderProduct)
productRouter.post('/updateRemainder', [checkRole, validate(ProductController.VIRequestUpdateRemainder)], ProductController.updateRemainder)


export default productRouter