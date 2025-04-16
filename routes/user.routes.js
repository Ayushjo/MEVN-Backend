import { Router } from "express";
import { loginUser, profileUser, userRegister } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router()

router.route("/register").post(userRegister)

router.route("/login").post(loginUser)

router.route("/profile").get(verifyToken ,profileUser)

export default router