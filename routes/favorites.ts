import { Router } from 'express'
import FavoritesController from '../controllers/favoritesController'
import { verifyToken } from '../middlewars/authMiddleware'
const favoritesRouter = Router()

favoritesRouter.post('/add', verifyToken, FavoritesController.addProductToFavorites)
favoritesRouter.post('/remove', verifyToken, FavoritesController.removeProductFromFavorites)

export default favoritesRouter