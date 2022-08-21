import { Router } from 'express'
import TypesProductController from '../controllers/typesController'

const typesProductRouter = Router()

typesProductRouter.get('/', TypesProductController.getAll)
typesProductRouter.post('/', TypesProductController.create)

export default typesProductRouter