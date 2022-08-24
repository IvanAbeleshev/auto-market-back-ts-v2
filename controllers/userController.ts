import { Request, Response } from 'express'
import { user } from '../models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//======================================
//interfaces
interface IRequest extends Request{
    body:{
        email: string,
        phone?: string,
        password: string
    }
}

//======================================
// helper function
const createJWT = (id: number, email: string) =>{
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
        )
}

//======================================
// class-controller
export default class UserController{

    public static registration = async(req: IRequest, res: Response) =>{

        const userInDb = await user.findOne({where:{email:req.body.email}})
        if(userInDb){
            return res.status(409).json({message: 'User Already Exist. Please Login'})
        }

        const hashPassword = bcrypt.hashSync(req.body.password, 10)
        const itemUser = await user.create({email: req.body.email, phone: req.body.phone, password: hashPassword})

        res.json({token: createJWT(itemUser.getDataValue('id'), itemUser.getDataValue('email'))})
    }

    public static login = async(req: IRequest, res: Response) =>{
        const findedUser = await user.findOne({where:{email: req.body.email}})
        if(findedUser && bcrypt.compareSync(req.body.password, findedUser.getDataValue('password'))){
            res.json({json: createJWT(findedUser.getDataValue('id'), req.body.email)})
        }
    }

    
}