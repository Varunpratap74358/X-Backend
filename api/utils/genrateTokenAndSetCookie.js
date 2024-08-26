import jwt from 'jsonwebtoken'

export const genrateTokenAndSetCookie=(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWTSECRET,{expiresIn:'7d'})
    res.cookie('jwt',token,{
        maxAge:15*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict"
    })
}
