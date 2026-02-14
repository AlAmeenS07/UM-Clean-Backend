
import express from "express"
import { adminAuthMiddleware } from "../middlewares/admin.auth.middleware"
import { AdminController } from "../controllers/admin.controller"

const router = express.Router()

const controller = new AdminController()

router.post("/login" , controller.login)
router.post("/logout" , controller.logout)
router.get("/users" , adminAuthMiddleware , controller.getUers)
router.get("/users/:id" , adminAuthMiddleware , controller.getUser)
router.patch("/user/:id/status" , adminAuthMiddleware , controller.changeUserStatus)

export default router