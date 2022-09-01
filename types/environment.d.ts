import { myJwtPayload } from "./exportsInterfaces"

export{}

declare global{
  namespace NodeJS{
    interface ProcessEnv{
        DB_NAME: string,
        DB_USER: string,
        DB_PASSWORD: string,
        DB_HOST: string,
        DB_PORT: number,
        SECRET_KEY: string,
        DEFAULT_COUNT_PRODUCTS_MOST_POPULAR: number
    }
  }
  namespace Express {
    interface Request {
       user?: myJwtPayload
    }
  }
}
