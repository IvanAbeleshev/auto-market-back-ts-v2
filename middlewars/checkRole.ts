import { NextFunction, Request, Response } from 'express'
import { myJwtPayload } from '../types/exportsInterfaces'
import jwt from 'jsonwebtoken'
import { type } from 'os'

type admin = 'admin'

export const checkRole = (req: Request , res: Response, next: NextFunction) =>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']!.split(' ')[1]

    if (!token) {
        return res.status(403).json({message: 'A token is required for authentication'})
    }

    try {
        req.user = <myJwtPayload>jwt.verify(token, process.env.SECRET_KEY)
    } catch (err) {
        return res.status(401).json({message:'Invalid Token'})
    }

    if(req.user.role==='admin'){
        return res.status(403).json({message: 'You have no admin permit'})            
    }
        
    return next()
}