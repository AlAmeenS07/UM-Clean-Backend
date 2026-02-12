import { Request , Response , NextFunction } from "express";
import { Status } from "../utils/enums";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UNAUTHORIZED } from "../utils/constants";


export const userAuthMiddleware = async(req : Request , res : Response , next : NextFunction)=>{
    try {

        let token = req.cookies?.token

        let decode = jwt.verify(token , String(process.env.JWT_SECRET)) as JwtPayload

        if(!decode.id || !decode.email){
            return res.status(Status.NOT_FOUND).json({success : false , message : UNAUTHORIZED})
        }

        (req as any).userEmail = decode.email

        next()
        
    } catch (error : any) {
        res.status(Status.SERVER_ERROR).json({success : false , message : error.message})
    }
}