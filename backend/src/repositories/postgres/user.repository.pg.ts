
import prisma from "../../config/db";
import { IUserRepository } from "../interfaces/user.repository";
import { Role, User } from "@prisma/client";

export class PostgresUserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<User | null> {
      let data = prisma.user.findUnique({
          where: { email }
      })
      return data
  }

  async create(user: { email: string; name: string; password: string; role: Role }): Promise<User> {
    let data = prisma.user.create({
        data: user
    })
    return data
  }
}
