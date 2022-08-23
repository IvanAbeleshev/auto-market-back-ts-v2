import { Request, Response } from 'express'
import {imageProduct, product, remainderProduct} from '../models'
import {v4} from 'uuid'
import fileUpload, { FileArray, UploadedFile } from 'express-fileupload'
import path from 'path'

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
    public static create = async(req: IRequestCreate, res:Response) =>{
        
        const arrayFilesName = renameAndMoveFileImg(req.files)

        //create product
        const productObject: IProduct = req.body
        const itemProduct = await product.create({...productObject})

        //add img to table
        addImgsNameToDbTable(arrayFilesName, itemProduct.getDataValue('id'))

        res.json({...itemProduct, imgNames: arrayFilesName})
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

    public static addImg = (req: IRequestGetOne, res: Response)=>{
        const arrayFilesName = renameAndMoveFileImg(req.files)
        addImgsNameToDbTable(arrayFilesName, Number(req.params.id))

        res.json({imgNames: arrayFilesName})
    }

    public static updateRemainder = async(req: IRequestUpdateRemainder, res: Response) => {
        const incomingArray = req.body.data;
        for(let item in incomingArray){
            updateOrCreateRemainder(incomingArray[item].productId, incomingArray[item])
        }
        
        //need add check for update or use try/catch
        res.json({status: true, message: 'remainder product is update'})
    }

    public static updateRemainderProduct = async(req: IRequestUpdateRemainderProduct, res: Response) =>{
        updateOrCreateRemainder(Number(req.params.id), {productId: req.body.productId, remainder: req.body.productId})
        res.json({status: true, message: 'remainder product is update'})
    }
}

