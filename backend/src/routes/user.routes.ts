import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { userAuthMiddleware } from "../middlewares/user.auth.middleware";

const router = Router();
const controller = new UserController();

router.post("/register", controller.register);
router.post('/login' , controller.login)
router.post('/logout' , controller.logout)
router.get("/profile" , userAuthMiddleware , controller.profile)

export default router;
