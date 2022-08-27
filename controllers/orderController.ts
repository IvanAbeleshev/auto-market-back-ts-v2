import { Request, Response } from "express";
import createAnswer from "../common/createAnswear";
import { order, orderProducts } from "../models";

//======================================
// interfaces
interface IRequestOrder extends Request{
    body:{
        userId: number,
        dataProducts:{
            count: number,
            sum: number,
            productId: number
        }[]
    }
}

//======================================
// class-controller
export default class OrderController{
    public static createOrder = async(req: IRequestOrder, res: Response) =>{
        const itemOrder = await order.create({userId: req.body.userId})
        for(let index in req.body.dataProducts){
            await orderProducts.create({...req.body.dataProducts[index], orderId: itemOrder.getDataValue('id')})
        }

        return createAnswer(res, 200, false, 'ok', itemOrder)
    }
}