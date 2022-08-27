import { typesProduct } from "../models"
import { Request, Response } from 'express'
import createAnswer from "../common/createAnswear"

interface IRequestCreate extends Request{
    body:{
        name: string,
        guid: string
    }   
}

export default class TypesProductController{
    public static create = async(req: IRequestCreate, res: Response) =>{
        const itemTypes = await typesProduct.create({...req.body})
        return createAnswer(res, 200, false, 'ok', itemTypes)
    }

    public static getAll = async(req: Request, res: Response) =>{
        const arrayTypesProduct = await typesProduct.findAll()
        
        return createAnswer(res, 200, false, 'ok', arrayTypesProduct)
    }
}