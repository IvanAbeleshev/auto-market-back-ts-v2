import { Request, Response } from 'express'
import { user } from '../models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createAnswer from '../common/createAnswear'
import { Joi } from 'express-validation'
import { myJwtPayload, role } from '../types/exportsInterfaces'

//======================================
//interfaces
interface IRequest extends Request{
    body:{
        email: string,
        phone?: string,
        password: string
    }
}

interface IUserData {
    user: myJwtPayload,
    token: string,
}
//======================================
// helper function
const createJWT = (id: number, email: string, role: role) =>{
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
        )
}

//======================================
// class-controller
export default class UserController{
    public static VIRequest = {
        body: Joi.object({
            email: Joi.string().email().required(),
            phone: Joi.string(),
            password: Joi.string().required()
        })
    }

    public static registration = async(req: IRequest, res: Response) =>{

        const userInDb = await user.findOne({where:{email:req.body.email}})
        if(userInDb){
            return createAnswer(res, 409, true, 'User Already Exist. Please Login')
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10)
        const itemUser = await user.create({email: req.body.email, phone: req.body.phone, password: hashPassword})

        return createAnswer(res, 200, false, 'Create new user. Wellcome', {token: createJWT(itemUser.getDataValue('id'), itemUser.getDataValue('email'), itemUser.getDataValue('role'))})

    }

    public static login = async(req: IRequest, res: Response) =>{
        const findedUser = await user.findOne({where:{email: req.body.email}})
        if(findedUser && bcrypt.compareSync(req.body.password, findedUser.getDataValue('password'))){
            return createAnswer(res, 200, false, 'Wellcome', {token: createJWT(findedUser.getDataValue('id'), req.body.email, findedUser.getDataValue('role'))})
        }

        return createAnswer(res, 401, true, 'User is not finded or not exist')

    }

    public static checkUser = async(req: Request, res: Response) =>{
        if(req.user){
            const data: IUserData = {
                user: req.user,
                token: createJWT(req.user.id, req.body.email, req.user.role?req.user.role: 'user')
            }
            return createAnswer(res, 200, false, 'user data', data)        
        }

        return createAnswer(res, 401, true, 'User is not finded or not exist')    
    }

    
}