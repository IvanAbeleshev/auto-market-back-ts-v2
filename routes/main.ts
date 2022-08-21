import { Router } from "express";
import productRouter from "./product"
import typesProductRouter from "./types";


const mainRouter = Router()
mainRouter.use('/product', productRouter)
mainRouter.use('/types', typesProductRouter)

export default mainRouter