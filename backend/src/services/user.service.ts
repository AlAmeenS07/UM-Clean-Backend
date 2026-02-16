import { IUserRepository } from "../repositories/interfaces/user.repository";
import bcrypt from "bcryptjs";
import { Role, User } from "@prisma/client";
import jwt from "jsonwebtoken"
import { INVALID_PASSWORD, USER_ACCOUNT_BLOCKED, USER_ALREADY_EXISTS, USER_NOT_FOUND_WITH_EMAIL } from "../utils/constants";
import { userQueue } from "../queues/user.queue";

export class UserService {

  constructor(private _userRepo: IUserRepository) { }

  async registerUser(data: { email: string, name: string, password: string, role?: Role }): Promise<User> {

    const existingUser = await this._userRepo.findByEmail(data.email);

    if (existingUser) {
      throw new Error(USER_ALREADY_EXISTS)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const role = "USER"

    let user = await this._userRepo.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role,
    });

    await userQueue.add(
      "sync-user",
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );


    return user

  }

  async loginUser(email: string, password: string): Promise<{ user: User, token: string }> {

    let user = await this._userRepo.findByEmail(email)

    if (!user) {
      throw new Error(USER_NOT_FOUND_WITH_EMAIL);
    }

    if (!user.isActive) {
      throw new Error(USER_ACCOUNT_BLOCKED);
    }

    let checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      throw new Error(INVALID_PASSWORD);
    }

    let token = jwt.sign({ id: user.id, email: user.email }, String(process.env.JWT_SECRET), { expiresIn: "1d" })

    return { user, token }
  }

  async userData(email : string) : Promise<User>{
    let user = await this._userRepo.findByEmail(email)

    if(!user){
      throw new Error(USER_NOT_FOUND_WITH_EMAIL);
    }

    return user
  }


}
