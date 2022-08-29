import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'express-validation'
import createAnswer from '../common/createAnswear'

const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) =>{
    if(error instanceof ValidationError){
        return createAnswer(res, error.statusCode, true, 'Validation error', error)
    }

    return createAnswer(res, 500, true, 'Error is undefined', error)
}

export default errorMiddleware