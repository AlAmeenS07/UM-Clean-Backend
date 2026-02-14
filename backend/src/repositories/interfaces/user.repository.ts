import { Role, User ,  } from "@prisma/client";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id : string) : Promise<User | null>
  create(user: {
    email: string;
    name: string;
    password: string;
    role: Role;
  }): Promise<User>;
  findAllUsersExceptAdmin(): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}