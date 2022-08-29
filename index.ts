import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import {SequelizeInstance} from './db'
import mainRouter from './routes/main'
import fileUpload from 'express-fileupload'
import path from 'path'
import errorMiddleware from './middlewars/errorMiddleware'

const portApplication = process.env.PORT || 7000

const server: express.Application = express()
server.use(express.json())
server.use(cors())
server.use(fileUpload())
server.use(express.static(path.resolve(__dirname, 'static')))
server.use('/api', mainRouter)

//error middleware
server.use(errorMiddleware)

const startServer = async() =>{
    let countTry = 5;
    for(let i=0; i<=countTry; i++){
        try{       
            await SequelizeInstance.authenticate()
            await SequelizeInstance.sync()

            server.listen(portApplication , ()=>{console.log(`Server starting on port ${portApplication}`)})
            break
        }
        catch(e){
            console.log("web server will bee restarted at 5s")
            await new Promise(res=>setTimeout(res, 5000))
            
        }

    }
}

startServer()