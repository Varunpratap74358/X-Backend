import express from "express";
import { protectedRoute } from "../middlware/protectedRoute.js";
import { deleteNotifications,deleteNotification, getNotiFication } from "../contoler/notificationControler.js";
const router = express.Router()

router.get("/",protectedRoute,getNotiFication)
router.delete("/",protectedRoute,deleteNotifications)
router.delete("/:id",protectedRoute,deleteNotification)


export default router