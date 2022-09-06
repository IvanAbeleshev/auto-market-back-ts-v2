import { typesProduct } from "../models"
import { Request, Response } from 'express'
import createAnswer from "../common/createAnswear"
import { Joi } from "express-validation"

interface IRequestCreate extends Request{
    body:{
        name: string,
        guid: string
    }   
}

export default class TypesProductController{
    public static VIRequestCreate = {
        body: Joi.object({
            name: Joi.string().required(),
            guid: Joi.string().required()
        })
    };

    public static create = async(req: IRequestCreate, res: Response) =>{
        const possibleResult = await typesProduct.findOne({where:{guid: req.body.guid}})
        if(possibleResult){
            await typesProduct.update({...req.body}, {where: {...req.body}})
            return createAnswer(res, 200, false, 'data is updated', possibleResult)    
        }
        const itemTypes = await typesProduct.create({...req.body})
        return createAnswer(res, 200, false, 'ok', itemTypes)
    }

    public static getAll = async(req: Request, res: Response) =>{
        const arrayTypesProduct = await typesProduct.findAll()
        
        return createAnswer(res, 200, false, 'ok', arrayTypesProduct)
    }
}