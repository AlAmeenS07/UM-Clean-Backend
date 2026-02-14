import { Request, Response } from "express"
import { PostgresUserRepository } from "../repositories/postgres/user.repository.pg";
import { AdminService } from "../services/admin.service";
import { COOKIE_TOKEN, EMAIL_AND_PASSWORD_REQUIRED, INVALID_EMAIL, LOGIN_SUCCESSFULLY, LOGOUT_SUCCESSFULLY, USER_STATUS_UPDATED, USERS_FETCH_SUCCESSFULLY, USERS_NOT_FOUND } from "../utils/constants";
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

        } catch (error: any) {
            res.status(Status.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    getUers = async (req: Request, res: Response) => {
        try {

            let users = await this.adminService.getUsersService()

            if (!users) {
                throw new Error(USERS_NOT_FOUND);
            }

            res.status(Status.SUCCESS).json({
                success: true,
                message: USERS_FETCH_SUCCESSFULLY,
                users: users
            })

        } catch (error: any) {
            res.status(Status.SERVER_ERROR).json({ success: false, message: error.message })
        }
    }

    getUser = async (req: Request, res: Response) => {
        try {

            let userId = req.params.id as string

            let user = await this.adminService.userData(userId)

            if (!user) {
                throw new Error(USERS_NOT_FOUND);
            }

            res.status(Status.SUCCESS).json({
                success : true,
                message : USERS_FETCH_SUCCESSFULLY,
                user : {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            })

        } catch (error: any) {
            res.status(Status.SERVER_ERROR).json({ success: false, message: error.message })
        }
    }


    changeUserStatus = async (req: Request, res: Response) => {
        try {

            const userId = req.params.id as string
            const { isActive } = req.body

            let user = await this.adminService.updateUserStatus(userId, isActive)

            res.status(Status.SUCCESS).json({
                success: false,
                message: USER_STATUS_UPDATED,
                user
            })

        } catch (error: any) {
            res.status(Status.BAD_REQUEST).json({ success: false, message: error.message })
        }
    }

    logout = async (req: Request, res: Response) => {
        try {

            res.clearCookie(COOKIE_TOKEN, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            })

            res.status(Status.SUCCESS).json({
                success: true,
                message: LOGOUT_SUCCESSFULLY
            })

        } catch (error: any) {
            res.status(Status.SERVER_ERROR).json({ success: false, message: error.message })
        }
    }

}