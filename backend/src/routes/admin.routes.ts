
import express from "express"
import { adminAuthMiddleware } from "../middlewares/admin.auth.middleware"
import { AdminController } from "../controllers/admin.controller"

const router = express.Router()

const controller = new AdminController()

router.post("/login" , controller.login)
router.get("/users" , adminAuthMiddleware , controller.getUers)

export default router