import express from "express";
import { getMe, login, logout, signup } from "../contoler/authControler.js";
import { protectedRoute } from "../middlware/protectedRoute.js";
const router = express.Router()

router.get("/me",protectedRoute,getMe)
router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)


export default router