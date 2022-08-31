import { NextFunction, Request, Response } from 'express'
import {imageProduct, product, remainderProduct} from '../models'
import {v4} from 'uuid'
import fileUpload, { UploadedFile } from 'express-fileupload'
import path from 'path'
import { SequelizeInstance } from '../db'
import createAnswer from '../common/createAnswear'
import { Joi } from 'express-validation'

//======================================
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

interface IDataRemainder{
    productId: number, 
    remainder: number
}

interface IRequestUpdateRemainder extends Request{
    body:{
        data: IDataRemainder[]
    }    
}

interface IRequestUpdateRemainderProduct extends IRequestGetOne{
    body: IDataRemainder
}

//======================================
//helpers functions
const renameAndMoveFileImg = (files: fileUpload.FileArray | undefined):string[] | void[]=>{
    const arrayFilesName: string[] = []
    for(let item in files){
        const currentFile: UploadedFile = <UploadedFile>files[item];
        let fileName = v4()+'.jpeg'
        currentFile.mv(path.resolve(__dirname, '..', 'static', fileName))
        arrayFilesName.push(fileName)
    }

    return arrayFilesName
}

const addImgsNameToDbTable = (arrayNames: string[] | void[], productId:number): void =>{
    for(let item in arrayNames){
        imageProduct.create({name: arrayNames[item], productId})
    }    
}

const updateOrCreateRemainder = async(productId: number, dataItem:IDataRemainder) =>{
    const findedElement = await remainderProduct.findOne({where: {productId}})    
    if(findedElement){
        await findedElement.update(dataItem)
    }else{
        await remainderProduct.create({...dataItem})
    }
}
//======================================
// class-controller
export default class ProductController{
    //object for validate request
    public static VIRequestGetAll = {
        query: Joi.object({
            typeId: Joi.string(),
            limit: Joi.string(),
            page: Joi.string(),
        })
    }

    public static VIRequestGetOne = {
        params: Joi.object({
            id: Joi.number().required()
        })
    }

    public static VIRequestCreate = {
        body: Joi.object({
            id: Joi.number(),
            typesProductId: Joi.number().required(),
            guid: Joi.string().required(),
            name: Joi.string().required(),
            fullName: Joi.string(),
            actualPrice: Joi.number().required(),
            oldPrice: Joi.number(),
            mainNameImg: Joi.string() 
        })
    }

    public static VIRequestUpdateRemainderProduct = {
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            productId: Joi.number().required(), 
            remainder: Joi.number().required()
        })
    }

    public static VIRequestUpdateRemainder = {
        params: Joi.object({
            id: Joi.number().required()
        }),
        body: Joi.object({
            data: Joi.array().items({
                productId: Joi.number().required(), 
                remainder: Joi.number().required()
            })
            
        })
    }
    //functions
    public static create = async(req: IRequestCreate, res:Response) =>{
        
        const arrayFilesName = renameAndMoveFileImg(req.files)

        //create product
        const productObject: IProduct = req.body
        const itemProduct = await product.create({...productObject})

        //add img to table
        addImgsNameToDbTable(arrayFilesName, itemProduct.getDataValue('id'))

        return createAnswer(res, 200, false, 'Product added to base', {...itemProduct, imgNames: arrayFilesName})
    }

    public static getAll = async(req: IRequestGetAll, res:Response)=>{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const offset = page*limit-limit;

        let productList

        if(req.query.typeId){
            productList = await product.findAndCountAll({where: {typesProductId: req.query.typeId}, limit, offset})
        }else{
            productList = await product.findAndCountAll({limit, offset})
        }

        return createAnswer(res, 200, false, 'Take actual product list', productList)
    }

    public static getOne = async(req: IRequestGetOne, res: Response, next: NextFunction)=>{
        const item = await product.findOne({where:{id: req.params.id}})
        return createAnswer(res, 200, false, `Take data product with id: ${req.params.id}`, <Object>item)
    }

    public static addImg = (req: IRequestGetOne, res: Response)=>{
        const arrayFilesName = renameAndMoveFileImg(req.files)
        addImgsNameToDbTable(arrayFilesName, Number(req.params.id))

        return createAnswer(res, 200, false, `Images added to product with id: ${req.params.id}`, arrayFilesName)
    }

    public static updateRemainder = async(req: IRequestUpdateRemainder, res: Response) => {
        const incomingArray = req.body.data;
        for(let item in incomingArray){
            updateOrCreateRemainder(incomingArray[item].productId, incomingArray[item])
        }
        
        return createAnswer(res, 200, false, 'Remainder product is updated')
    }

    public static updateRemainderProduct = async(req: IRequestUpdateRemainderProduct, res: Response) =>{
        updateOrCreateRemainder(Number(req.params.id), {productId: req.body.productId, remainder: req.body.productId})
        return createAnswer(res, 200, false, 'Remainder product is update')
    }

    public static getMostPopularProductByTypes = async(_:Request, res:Response) => {
        //temp query
        const query=`
        SELECT 
            "orderProducts"."id",
            "orderProducts"."count" as countProduct,
            "orderProducts"."sum" as sumProduct,
            "orderProducts"."productId" as productid,
            "orderProducts"."orderId",
            "products"."name" as nameProduct,
            "products"."typesProductId" as idTypes
        FROM "orderProducts", "products"
        where "orderProducts"."productId" = "products".id
        `
              
        const [results] = await SequelizeInstance.query(query);
        
        return createAnswer(res, 200, false, 'Take most popular product list', results)
    }
}

