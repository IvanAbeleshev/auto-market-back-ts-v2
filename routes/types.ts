import { Router } from 'express'
import { validate } from 'express-validation'
import TypesProductController from '../controllers/typesController'
import { checkRole } from '../middlewars/checkRole'

const typesProductRouter = Router()

typesProductRouter.get('/', TypesProductController.getAll)
typesProductRouter.post('/', [checkRole, validate(TypesProductController.VIRequestCreate)], TypesProductController.create)

export default typesProductRouter