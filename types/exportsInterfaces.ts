export type role = 'admin'|'user'
export interface myJwtPayload{
    id: number,
    email: string,
    role?: role 
}
