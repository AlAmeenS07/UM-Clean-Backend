
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
  
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(user: { email: string; name: string; password: string; role: Role }): Promise<User> {
    let data = prisma.user.create({
      data: user
    })
    return data
  }

  async findAllUsersExceptAdmin(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

}
