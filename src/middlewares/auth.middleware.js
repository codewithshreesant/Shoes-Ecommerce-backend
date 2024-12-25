
import { User } from "../models/user.model.js"; 
import { ApiError } from "../utils/ApiError.js";  
import jwt from "jsonwebtoken"; 



const jwtVerify=async (req,res,next)=>{
    console.log("refresh token secretn ",process.env.REFRESH_TOKEN_SECRET)
    try{
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    console.log("TOKEN ", token)
    console.log(req.cookies);
    if(!token)
    {
        throw new ApiError(402, "Token not available ");
    }

    const validToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

    console.log("valid token ",validToken); 

    if(!validToken)
    {
        throw new ApiError(401, "Invalid Token ");
    }

    // console.log(user);

    const {_id}=validToken;

    const user=await User.findById(_id);

    req.user=user;

    // user.save({validationBeforeSave:false});

    next();
}catch(error){
    console.log("error o ",  error.message);
}

}

const logoutUserVerify=async (req,res,next)=>{
    // console.log("refresh token secretn ",process.env.REFRESH_TOKEN_SECRET)
    try{
    const token=req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","");
    console.log("TOKEN ", token)
    console.log(req.cookies);
    if(!token)
    {
        throw new ApiError(402, "Token not available ");
    }

    const validToken=jwt.verify(token, process.env.REFRESH_TOKEN_SECRET); 

    console.log("valid token ",validToken); 

    if(!validToken)
    {
        throw new ApiError(401, "Invalid Token ");
    }

    // console.log(user);

    const {_id}=validToken;

    const user=await User.findById(_id);

    req.user=user;

    // user.save({validationBeforeSave:false});

    next();
}catch(error){
    console.log("logoutUser Verify Error ",  error.message);
}

}


export {jwtVerify, logoutUserVerify} 