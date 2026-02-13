import { Request, Response } from "express"
import { PostgresUserRepository } from "../repositories/postgres/user.repository.pg";
import { AdminService } from "../services/admin.service";
import { COOKIE_TOKEN, EMAIL_AND_PASSWORD_REQUIRED, INVALID_EMAIL, LOGIN_SUCCESSFULLY, USERS_FETCH_SUCCESSFULLY, USERS_NOT_FOUND } from "../utils/constants";
import { Status } from "../utils/enums";


export class AdminController {

    private adminService: AdminService

    constructor() {
        const userRepo = new PostgresUserRepository();
        this.adminService = new AdminService(userRepo);
    }

    login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body

            if (!email || !password) {
                throw new Error(EMAIL_AND_PASSWORD_REQUIRED);
            }

            if (!email.includes("@")) {
                throw new Error(INVALID_EMAIL);
            }

            let { user, token } = await this.adminService.loginAdmin(email, password)

            res.cookie(COOKIE_TOKEN, token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            })

            res.status(Status.SUCCESS).json({
                success: true,
                message: LOGIN_SUCCESSFULLY,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            })

        } catch (error : any) {
            res.status(Status.BAD_REQUEST).json({success : false , message : error.message})
        }
    }

    getUers = async(req : Request , res : Response) =>{
        try {

            let users = await this.adminService.getUsersService()

            if(!users){
                throw new Error(USERS_NOT_FOUND);
            }

            res.status(Status.SUCCESS).json({
                success : true,
                message : USERS_FETCH_SUCCESSFULLY,
                users : users
            })
            
        } catch (error : any) {
            res.status(Status.SERVER_ERROR).json({success : false , message : error.message})
        }
    }

}