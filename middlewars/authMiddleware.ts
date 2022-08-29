import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import createAnswer from '../common/createAnswear'
import { myJwtPayload } from '../types/exportsInterfaces'

export const verifyToken = (req: Request , res: Response, next: NextFunction) =>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']!.split(' ')[1]

    if (!token) {
        return createAnswer(res, 403, true, 'A token is required for authentication')
    }

    try {
        req.user = <myJwtPayload>jwt.verify(token, process.env.SECRET_KEY)
    } catch (err) {
        return createAnswer(res, 401, true, 'Invalid Token')
    }
    
    return next()
}