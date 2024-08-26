import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { genrateTokenAndSetCookie } from "../utils/genrateTokenAndSetCookie.js"

export const signup = async(req,res)=>{
    try {
        const {username,fullName,email,password} = req.body

        const existUser = await User.findOne({username})
        if(existUser){
            res.status(400).json({
                error:"Username is already exist"
            })
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            res.status(400).json({
                error:"Email is already exist"
            })
        }

        // hash password
        const hashpassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            fullName,
            username,
            email,
            password:hashpassword,
        })
        genrateTokenAndSetCookie(newUser._id,res)
        res.status(201).json({
            message:"user create successfully...",
            newUser
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

export const login = async(req,res)=>{
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({username})
        if(!existingUser){
            return res.status(400).json({
                success:false,
                error:"User not exist..."
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                error:"password is wrong..."
            })
        }

        genrateTokenAndSetCookie(existingUser._id,res)
        res.status(200).json({
            message:"user login successfully...",
            existingUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}

export const logout = async(req,res)=>{
    try {
        res.status(200).cookie('jwt','',{maxAge:0}).json({
            message:"User logout successfully..."
        })
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getMe = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(
            user
        )
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
} 