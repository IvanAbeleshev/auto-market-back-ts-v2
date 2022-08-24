import { Router } from "express";
import favoritesRouter from "./favorites";
import productRouter from "./product"
import typesProductRouter from "./types";
import userRouter from "./user";

const mainRouter = Router()
mainRouter.use('/product', productRouter)
mainRouter.use('/types', typesProductRouter)
mainRouter.use('/user', userRouter)
mainRouter.use('/favorites', favoritesRouter)

export default mainRouter