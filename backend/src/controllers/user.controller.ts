import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { PostgresUserRepository } from "../repositories/postgres/user.repository.pg";
import { ALL_FIELDS_REQUIRED, COOKIE_TOKEN, EMAIL_AND_PASSWORD_REQUIRED, INVALID_EMAIL, LOGIN_SUCCESSFULLY, LOGOUT_SUCCESSFULLY, PASSWORD_MUST_6_LETTER, USER_REGISTERED_SUCCESSFULLY } from "../utils/constants";
import { Status } from "../utils/enums";

export class UserController {
  
  private userService: UserService;

  constructor() {
    const userRepo = new PostgresUserRepository();
    this.userService = new UserService(userRepo);
  }

  register = async (req: Request, res: Response) => {
      try {

        const {name , email , password} = req.body

        if(!name || !email || !password){
          throw new Error(ALL_FIELDS_REQUIRED);
        }

        if(!email.includes("@")){
          throw new Error(INVALID_EMAIL);
        }

        if(password.length < 6){
          throw new Error(PASSWORD_MUST_6_LETTER);
        }

        const user = await this.userService.registerUser(req.body);

        res.status(Status.CREATED).json({
          success: true,
          message: USER_REGISTERED_SUCCESSFULLY,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          }
        });
      } catch (error: any) {
        res.status(Status.BAD_REQUEST).json({ success: false, message: error.message });
      }
  };

  login = async(req : Request , res : Response)=>{
      try {

        const { email , password } = req.body

        if(!email || !password){
          throw new Error(EMAIL_AND_PASSWORD_REQUIRED);
        }

        if(!email.includes("@")){
          throw new Error(INVALID_EMAIL);
        }

        const { user , token } = await this.userService.loginUser(email , password);

        res.cookie(COOKIE_TOKEN , token , {
          httpOnly : true,
          secure : false,
          sameSite : "strict",
          maxAge : 24 * 60 * 60 * 1000
        })

        res.status(Status.SUCCESS).json({
          success : true,
          message : LOGIN_SUCCESSFULLY,
          user : {
            id : user.id,
            email : user.email,
            role : user.role
          }
        })

        
      } catch (error : any) {
        res.status(Status.BAD_REQUEST).json({success : false , message : error.message})
      }
  }

  logout = async(req : Request , res : Response) =>{
      try {

        res.clearCookie(COOKIE_TOKEN, {
          httpOnly : true,
          secure : false,
          sameSite : "strict"
        })

        res.status(Status.SUCCESS).json({
          success : true,
          message : LOGOUT_SUCCESSFULLY
        })
        
      } catch (error : any) {
          res.status(Status.SERVER_ERROR).json({success : false , message : error.message})
      }
  }

}
