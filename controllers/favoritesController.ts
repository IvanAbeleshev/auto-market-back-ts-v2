import { Request, Response } from 'express'
import { Joi } from 'express-validation';
import createAnswer from '../common/createAnswear'
import { favoriteUserProduct } from '../models'

//======================================
// interfaces
interface IRequestAddOrRemoveProductOfFavorites extends Request{
    body:{
        productId: number
    },
}

//======================================
// class-controller
export default class FavoritesController{
    public static VIRequestAddOrRemoveProductOfFavorites = {
        body: Joi.object({
            productId: Joi.number()    
        })
    };
    public static addProductToFavorites = async(req: IRequestAddOrRemoveProductOfFavorites, res: Response) => {
        if(!req.user){
            return createAnswer(res, 403, true, 'user is unlogin')
        }
        const userId = req.user.id
        
        const findedProduct = await favoriteUserProduct.findOne({where: { productId: req.body.productId, userId }})
        
        if(!findedProduct){
            const newRecord = await favoriteUserProduct.create({ productId: req.body.productId, userId })
            return createAnswer(res, 200, false, 'ok', newRecord)
        }

        return createAnswer(res, 200, false, 'product already added to favorite')
    }

    public static removeProductFromFavorites = async(req: IRequestAddOrRemoveProductOfFavorites, res: Response)=>{
        if(!req.user){
            return createAnswer(res, 403, true, 'user is unlogin')
        }
        const userId = req.user.id

        await favoriteUserProduct.destroy({where:{
            userId,
            productId: req.body.productId
        }})

        return createAnswer(res, 200, false, 'product is removed from favorites')
    }

}