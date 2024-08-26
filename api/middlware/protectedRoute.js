import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt
        
        if(!token){
            return res.status(400).json({error:"Login First"})
        }
        const decoded =await jwt.verify(token,"54555%^&%^%%^5444")
        if(!decoded){
            return  res.status(400).json({error:"Invalid token"})
        }
        const user = await User.findById(decoded.userId)
        if(!user){
           return res.status(400).json({error:"user not found"})
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"protected route",error})
        // next()
    }
}