import { IUserRepository } from "../repositories/interfaces/user.repository";
import bcrypt from "bcryptjs";
import { Role, User } from "@prisma/client";
import jwt from "jsonwebtoken"
import { INVALID_PASSWORD, USER_ALREADY_EXISTS, USER_NOT_FOUND_WITH_EMAIL } from "../utils/constants";

export class UserService {
  
  constructor(private readonly userRepo: IUserRepository) {}

  async registerUser(data: { email: string , name: string , password: string , role?: Role }): Promise<User> {

    const existingUser = await this.userRepo.findByEmail(data.email);

    if (existingUser) {
      throw new Error(USER_ALREADY_EXISTS)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const role =  "USER"

    return this.userRepo.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role,
    });
  }

  async loginUser(email : string , password : string) : Promise<{ user : User , token : string}>{

      let user = await this.userRepo.findByEmail(email)

      if(!user){
        throw new Error(USER_NOT_FOUND_WITH_EMAIL);
      }

      let checkPassword = await bcrypt.compare(password , user.password)

      if(!checkPassword){
        throw new Error(INVALID_PASSWORD);
      }

      let token = jwt.sign({id : user.id , email : user.email} , String(process.env.JWT_SECRET) , {expiresIn : "1d"})

      return { user , token }
  }

}
