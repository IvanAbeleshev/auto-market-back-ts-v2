import { typesProduct } from "../models"
import { Request, Response } from 'express'

interface IRequestCreate extends Request{
    body:{
        name: string,
        guid: string
    }   
}

export default class TypesProductController{
    public static create = async(req: IRequestCreate, res: Response) =>{
        const itemTypes = await typesProduct.create({...req.body})
        res.json(itemTypes)
    }

    public static getAll = async(req: Request, res: Response) =>{
        const arrayTypesProduct = await typesProduct.findAll()
        res.json(arrayTypesProduct)
    }
}