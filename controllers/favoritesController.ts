import { Request, Response } from 'express'
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
    public static addProductToFavorites = async(req: IRequestAddOrRemoveProductOfFavorites, res: Response) => {
        if(!req.user){
            return res.json({message: 'user is unlogin'})
        }
        const userId = req.user.id

        const [item, created] = await favoriteUserProduct.findOrCreate({
            where: { productId: req.body.productId, userId },
            defaults: {
                productId: req.body.productId,
                userId
            }
          });
        
        if(created){
            res.json(item)
        }

        //need create universal format response!!!
        res.json({message:'product cant added to favorites'})
    }

    public static removeProductFromFavorites = async(req: IRequestAddOrRemoveProductOfFavorites, res: Response)=>{
        if(!req.user){
            return res.json({message: 'user is unlogin'})
        }
        const userId = req.user.id

        await favoriteUserProduct.destroy({where:{
            userId,
            productId: req.body.productId
        }})

        res.json({message: 'product had removed from favorites user'})
    }

}