import { NextFunction, Request, Response } from 'express'
import {favoriteUserProduct, imageProduct, product, remainderProduct, typesProduct} from '../models'
import {v4} from 'uuid'
import fileUpload, { UploadedFile } from 'express-fileupload'
import path from 'path'
import { SequelizeInstance } from '../db'
import createAnswer from '../common/createAnswear'
import { Joi } from 'express-validation'
import { writeFileSync } from 'fs'

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
    typesProductId?: number,
    typesProductGuid?: number,
    guid: string,
    name: string,
    article?: string,
    description?: string,
    fullName?: string,
    actualPrice: number,
    oldPrice?: number,
    mainNameImg?: string   
}

interface IRequestCreate extends Request{
    body: IProduct
}

interface IDataRemainder{
    productId?: number, 
    guid?: string,
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

interface IRequestMostPopular extends Request{
    query:{
        typesProductId?: string,
        limit?: string
    }
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

const updateOrCreateRemainder = async(productId: number, dataItem:{productId: number, remainder: number}) =>{
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
            id: [Joi.string().required(), Joi.number().required()]
        })
    }

    public static VIRequestCreate = {
        body: Joi.object({
            id: Joi.number(),
            typesProductId: Joi.number(),
            typesProductGuid: Joi.string(),
            guid: Joi.string().required(),
            name: Joi.string().required(),
            article: Joi.string(),
            description: Joi.string(),
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
            productId: Joi.number(), 
            guid: Joi.string(), 
            remainder: Joi.number().required()
        })
    }

    public static VIRequestUpdateRemainder = {
        body: Joi.object({
            data: Joi.array().items({
                productId: Joi.number(), 
                guid: Joi.string(), 
                remainder: Joi.number().required()
            })
            
        })
    }

    public static VIRequestMostPopular = {
        query: Joi.object({
            typesProductId: Joi.number(),
            limit: Joi.number()                
        })
    }
    //functions
    public static create = async(req: IRequestCreate, res:Response) =>{
        
        const arrayFilesName = renameAndMoveFileImg(req.files)

        if(!req.body.typesProductId){
            //we can search types by guid
            const findedByGuid = await typesProduct.findOne({where: {guid: req.body.typesProductGuid}})       
            req.body.typesProductId = findedByGuid?.getDataValue('id')
        }
        const productObject: IProduct = req.body
        
        const objectForSearch: {id?: number, guid?: string} = {}
        if(req.body.id){
            objectForSearch.id = req.body.id
        }else if(req.body.guid){
            objectForSearch.guid = req.body.guid    
        }

        const previousValueItem = await product.findOne({where: objectForSearch})
        if(previousValueItem){
            //update record
            await product.update({...productObject}, {where: objectForSearch})
            addImgsNameToDbTable(arrayFilesName, previousValueItem.getDataValue('id'))
            return createAnswer(res, 200, false, 'Product updated in base', {...previousValueItem, imgNames: arrayFilesName})
        }
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

    public static addImg = async(req: IRequestGetOne, res: Response)=>{

        if(!req.files){
            return createAnswer(res, 200, false, `image is not receive`)    
        }
        let idElement = req.params.id
        let itemByGuid = await product.findOne({where:{guid: req.params.id}})
        if (itemByGuid){
            idElement = itemByGuid.getDataValue('id')
        }else{
            if(typeof req.params.id === "string")
            {
                return createAnswer(res, 200, true, `id element is not finded`) 
            }
            
            itemByGuid = await product.findOne({where:{id: req.params.id}})
        }
        
        const arrayFilesName = renameAndMoveFileImg(req.files)
        addImgsNameToDbTable(arrayFilesName, Number(idElement))
        
        itemByGuid?.update({mainNameImg: arrayFilesName[0]})
        return createAnswer(res, 200, false, `Images added to product with id: ${req.params.id}`, arrayFilesName)
    }

    public static updateRemainder = async(req: IRequestUpdateRemainder, res: Response) => {
        const incomingArray = req.body.data;
        for(let item in incomingArray){
            if(incomingArray[item].productId){
                updateOrCreateRemainder(Number(incomingArray[item].productId), {productId: Number(incomingArray[item].productId), remainder: incomingArray[item].remainder})
            }else{
                const findedElement = await product.findOne({where:{guid: incomingArray[item].guid}})
                const idElementByGuid = Number(findedElement?.getDataValue('id'))
                if(idElementByGuid){
                    updateOrCreateRemainder(idElementByGuid, {productId: idElementByGuid, remainder: incomingArray[item].remainder})
                }
            }
        }
        
        return createAnswer(res, 200, false, 'Remainder product is updated')
    }

    public static updateRemainderProduct = async(req: IRequestUpdateRemainderProduct, res: Response) =>{
        if(req.body.productId){
            updateOrCreateRemainder(Number(req.params.id), {productId: req.body.productId, remainder: req.body.productId})
        }else{
            const findedElement = await product.findOne({where:{guid: req.body.guid}})
            const idElementByGuid = Number(findedElement?.getDataValue('id'))
            updateOrCreateRemainder(idElementByGuid, {productId: idElementByGuid, remainder: req.body.remainder})
        }

        
        return createAnswer(res, 200, false, 'Remainder product is update')
    }

    public static getMostPopularProductByTypes = async(req:IRequestMostPopular, res:Response) => {

        const limitProductByTypes = Number(req.query.limit) || process.env.DEFAULT_COUNT_PRODUCTS_MOST_POPULAR 

        let results
        console.log(req.query.typesProductId)
        if(req.query.typesProductId){
            results = await typesProduct.findAll({where:{id: req.query.typesProductId}})
        }else{
            results = await typesProduct.findAll()
        }

        console.log(results)
        //create new query text for result data
        //maybe need restrict data on period
        let queryText = ``
        for(let index in results){
            const currentId = results[index].getDataValue('id')
            if(Number(index)!==0){
                queryText += `
                union all
                `
            }
            queryText +=`
            select *
            From(
                select
                    "count",
                    "id",
                    "guid",
                    "name",
                    "fullName",
                    "actualPrice",
                    "oldPrice",
                    "mainNameImg",
                    "typesProductId"
                From(
                    select  
                        sum("orderProducts"."count") as "count",
                        "products"."id" as "id",
                        "products"."guid" as "guid",
                        "products"."name" as "name",
                        "products"."fullName" as "fullName",
                        "products"."actualPrice" as "actualPrice",
                        "products"."oldPrice" as "oldPrice",
                        "products"."mainNameImg" as "mainNameImg",
                        "products"."typesProductId" as "typesProductId"
                    from "orderProducts", "products" 
                    where 
                        "orderProducts"."productId" = "products"."id" 
                        and "products"."typesProductId" = ${currentId}
                    group by
                        "products"."id",
                        "products"."guid",
                        "products"."name",
                        "products"."fullName",
                        "products"."actualPrice",
                        "products"."oldPrice",
                        "products"."mainNameImg",
                        "products"."typesProductId"

                    union all

                    select  
                        1,
                        "products"."id",
                        "products"."guid",
                        "products"."name",
                        "products"."fullName",
                        "products"."actualPrice",
                        "products"."oldPrice",
                        "products"."mainNameImg",
                        "products"."typesProductId"
                    from "products" 
                    where 
                        "products"."typesProductId" = ${currentId}
                    group by
                        "products"."id",
                        "products"."guid",
                        "products"."name",
                        "products"."fullName",
                        "products"."actualPrice",
                        "products"."oldPrice",
                        "products"."mainNameImg",
                        "products"."typesProductId"
                ) "dataProducts"
                order by "count" desc
                limit ${limitProductByTypes}
            ) "typeGroup"
            `
        }
             
        [results] = await SequelizeInstance.query(queryText)
        
        return createAnswer(res, 200, false, 'Take most popular product list', results)
    }

    public static getFavorites = async(req: IRequestGetAll, res: Response)=>{
        if(!req.user){
            return createAnswer(res, 401, true, 'User is nod defined')
        }

        const queryText = `
        Select * from "products" where "products"."id" in (
            Select "productId" from "favoriteUserProducts" Where "favoriteUserProducts"."userId"= ${req.user.id} group by id)
            `
        const [results] = await SequelizeInstance.query(queryText)
    
        return createAnswer(res, 200, false, 'Favorites user', results)
    }
}

