
import { Request , Response, NextFunction } from "express";
import { ONLY_ADMIN_CAN_ASSECC, UNAUTHORIZED, UNEXPECTED_TOKEN_ERROR } from "../utils/constants";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Status } from "../utils/enums";
import { UserService } from "../services/user.service";
import { PostgresUserRepository } from "../repositories/postgres/user.repository.pg";

let userRepo = new PostgresUserRepository()
let userService = new UserService(userRepo)

export const adminAuthMiddleware = async(req : Request , res : Response , next : NextFunction)=>{
    try {

        let token = req.cookies?.token

        if(!token){
            throw new Error(UNEXPECTED_TOKEN_ERROR);
        }

        let decode = jwt.verify(token , String(process.env.JWT_SECRET)) as JwtPayload

        if(!decode.id || !decode.email){
            return res.status(Status.NOT_FOUND).json({success : false , message : UNAUTHORIZED})
        }

        let user = await userService.userData(decode.email)

        if(user.role != "ADMIN"){
            throw new Error(ONLY_ADMIN_CAN_ASSECC);
        }

        next()
        
    } catch (error : any) {
        res.status(Status.SERVER_ERROR).json({success : false , message : error.message})
    }
}