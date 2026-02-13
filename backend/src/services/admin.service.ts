import { User } from "@prisma/client";
import { IUserRepository } from "../repositories/interfaces/user.repository";
import { INVALID_PASSWORD, USER_NOT_FOUND_WITH_EMAIL, USERS_NOT_FOUND } from "../utils/constants";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class AdminService {
    constructor(private userRepo: IUserRepository) { }

    async loginAdmin(email: string, password: string): Promise<{ user: User, token: string }> {

        let user = await this.userRepo.findByEmail(email)

        if (!user) {
            throw new Error(USER_NOT_FOUND_WITH_EMAIL);
        }

        let checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            throw new Error(INVALID_PASSWORD);
        }

        let token = jwt.sign({ id: user.id, email: user.email }, String(process.env.JWT_SECRET), { expiresIn: "1d" })

        return { user, token }
    }

    async getUsersService() : Promise<User[]>{

        let users = await this.userRepo.findAllUsersExceptAdmin()
        
        if(!users){
            throw new Error(USERS_NOT_FOUND);
        }

        return users
    }


}