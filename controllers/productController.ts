import { Request, Response } from 'express'
import {imageProduct, product} from '../models'
import uuid from 'uuid'
import { UploadedFile } from 'express-fileupload'
import path from 'path'


//interfaces
interface IRequestGetAll extends Request{
    query:{
        typeId?: string,
        limit?: string,
        page?: string
    }
}

interface IRequestGetOne extends Request{
    params:{
        id: string
    }
}

interface IProduct{
    id?: number,
    typesProductId: number,
    guid: string,
    name: string,
    fullName?: string,
    actualPrice: number,
    oldPrice?: number,
    mainNameImg?: string   
}

interface IRequestCreate extends Request{
    body: IProduct
}

// class-controller
export default class ProductController{
    public static create = async(req: IRequestCreate, res:Response) => {
        //loop to save img files to static
        const arrayFilesName: string[] = []
        for(let item in req.files){
            const currentFile: UploadedFile = <UploadedFile>req.files[item];
            let fileName = uuid.v4()+'.jpg'
            currentFile.mv(path.resolve(__dirname, '..', 'static', fileName))
            arrayFilesName.push(fileName)
        }

        //create product
        const productObject: IProduct = req.body
        const itemProduct = await product.create({...productObject})

        //add img to table
        for(let item in arrayFilesName){
            imageProduct.create({name: arrayFilesName[item], productId: itemProduct.getDataValue('id')})
        }

        res.json(itemProduct)
    }

    public static getAll = async(req: IRequestGetAll, res:Response)=>{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = page*limit-limit;

        let productList

        if(req.query.typeId){
            productList = await product.findAndCountAll({where: {typesProductId: req.query.typeId}, limit, offset})
        }

        productList = await product.findAndCountAll({limit, offset})

        return res.json(productList)
    }

    public static getOne = async(req: IRequestGetOne, res: Response)=>{
        const item = await product.findOne({where:{id: req.params.id}})
        return res.json(item)
    }
}

