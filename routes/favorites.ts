import { Router } from 'express'
import { validate } from 'express-validation'
import FavoritesController from '../controllers/favoritesController'
import { verifyToken } from '../middlewars/authMiddleware'
const favoritesRouter = Router()

favoritesRouter.post('/add', [verifyToken, validate(FavoritesController.VIRequestAddOrRemoveProductOfFavorites)], FavoritesController.addProductToFavorites)
favoritesRouter.post('/remove', [verifyToken, validate(FavoritesController.VIRequestAddOrRemoveProductOfFavorites)], FavoritesController.removeProductFromFavorites)

export default favoritesRouter