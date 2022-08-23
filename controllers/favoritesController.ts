import { Request, Response } from 'express'
import { favoriteUserProduct } from '../models'

//======================================
// interfaces
interface IRequest extends Request{
    params:{
        userId: string
    }
}

interface IRequestAddOrRemoveProductOfFavorites extends IRequest{
    body:{
        productId: number
    }
}

//======================================
// class-controller
export default class FavoritesController{
    public static addProductToFavorites = async(req: IRequestAddOrRemoveProductOfFavorites, res: Response) => {
        const userId = Number(req.params.userId)
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
        const userId = Number(req.params.userId)

        await favoriteUserProduct.destroy({where:{
            userId,
            productId: req.body.productId
        }})

        res.json({message: 'product had removed from favorites user'})
    }

}