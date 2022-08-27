import { Router } from 'express'
import TypesProductController from '../controllers/typesController'
import { checkRole } from '../middlewars/checkRole'

const typesProductRouter = Router()

typesProductRouter.get('/', TypesProductController.getAll)
typesProductRouter.post('/', checkRole, TypesProductController.create)

export default typesProductRouter