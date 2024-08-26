import express from "express";
import {protectedRoute} from "../middlware/protectedRoute.js"
import { CommentOnPost,getfollowingPost,getUserPost,getAllPost,getLikesPost, createPost, deletePost, likeUnlikePost } from "../contoler/postControler.js";
const router = express.Router()

router.get("/like/:id",protectedRoute,getLikesPost)
router.get("/all",protectedRoute,getAllPost)
router.get("/user/:username",protectedRoute,getUserPost)
router.get("/following",protectedRoute,getfollowingPost)
router.post("/create",protectedRoute,createPost)
router.post("/like/:id",protectedRoute,likeUnlikePost)
router.post("/comment/:id",protectedRoute,CommentOnPost)
router.delete("/:id",protectedRoute,deletePost)

export default router