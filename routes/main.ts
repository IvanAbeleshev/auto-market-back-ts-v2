import { Router } from 'express'
import favoritesRouter from './favorites'
import orderRouter from './order'
import productRouter from './product'
import typesProductRouter from './types'
import userRouter from './user'

const mainRouter = Router()
mainRouter.use('/product', productRouter)
mainRouter.use('/types', typesProductRouter)
mainRouter.use('/user', userRouter)
mainRouter.use('/favorites', favoritesRouter)
mainRouter.use('/order', orderRouter)

export default mainRouter