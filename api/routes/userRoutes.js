import express from "express";
import {protectedRoute} from "../middlware/protectedRoute.js"
import { followUnfollowUser, getUserProfile,getSuggistUser, updateUserProfile } from "../contoler/userControler.js";
const router = express.Router()

router.get("/profile/:username",protectedRoute,getUserProfile )
router.get("/suggested",protectedRoute, getSuggistUser )
router.post("/follow/:id",protectedRoute,followUnfollowUser )
router.post("/update",protectedRoute, updateUserProfile )

export default router