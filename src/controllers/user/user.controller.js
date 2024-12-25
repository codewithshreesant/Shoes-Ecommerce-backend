import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import sendEmail from "../../helpers/gmail.js";

const generateAccessAndRefreshToken=async (userId)=>{
    const user=await User.findById(
        {_id:userId}
    )

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken=refreshToken;

    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
}

const createUser=asyncHandler(
    async (req,res,next)=>{
        const {username, email, password}=req.body;

        if(
            [username,email,password].some((field)=>{
                field?.trim()==""
            })
        )
        {
            throw new ApiError(401, "all fields  are required ");
        }

        const user=await User.find(
            {
                $or:[{username},{email}]
            }
        )

        if(user.length > 0)
        {
            throw new ApiError(402, "user already available ");
        }

        const savedUser=await User.create({
            username,
            email,
            password
        }
    )

    await savedUser.save();

    res.status(200)
    .json(
        new ApiResponse(
            200,
            {username, email},
            "User created Successfully ",
        )
    )

        // console.log("image ", req.file);
    }
)

const loginUser=asyncHandler(
    async (req,res,next)=>{
        const {email, password}=req.body;

        if(
            [email,password].some((field)=>{
                return field?.trim()==""
            })
        ){
            throw new ApiError(401,"All fields are required");
        }

        const user=await User.findOne(
            {
                email:email
            }
        )

        console.log("user login ", user)

        const isPasswordValid=await user.isPasswordCorrect(password);

        if(!isPasswordValid)
        {
            throw new ApiError(
                401,
                "Password is incorrect "
            )
        }

        if(user.length <= 0)
        {
            throw new ApiError(402,"User not available ");
        }

        const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id);

        const options={
            httpOnly:true,
            secure:true
        }

        await sendEmail({email, emailType:'VERIFY EMAIL', userId:user._id});
        
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken},
                "User LoggedIn Successfull"
            )
        )

    }
)

const logoutUser=asyncHandler(
    async (req,res,next)=>{
        console.log("request  user ",req.user);
        
        const {_id}=req.user;
        console.log("id",_id);
        const user=await User.findByIdAndUpdate(
            _id,
            { $unset: { refreshToken: "" } },// Using $unset to remove the field },
            {new:true}
        )

        console.log("user ", user);

        const options={
            httpOnly:true,
            secure:true
        }

        res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                user,
                "User Loggedout Successfully "
            )
        )

    }
)

const  updatePassword=asyncHandler(
    async (req,res,next)=>{
        const {oldPassword, newPassword, confirmPassword}=req.body;

        if(newPassword !== confirmPassword)
        {
            throw new ApiError(402, "Password does not match");
        }

        console.log("request cookies ",req.cookies);
        // console.log("request user ",req.user);

        const userInfo=jwt.verify(req.cookies?.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("userInfo ", userInfo);

        const {_id}=userInfo;

        const user=await User.findById({_id:_id});

        const isPasswordValid=await user.isPasswordCorrect(oldPassword);

        if(!isPasswordValid)
        {
            throw new ApiError(
                401, "Invalid Password "
            )
        }

        user.password=newPassword;

        await user.save({validationBeforeSave:false});

        res.status(
            new ApiResponse(
                200,
                "Password Changed Successfully "
            )
        )

    }
)

const getAllUsers=asyncHandler(
    async (req,res,next)=>{
        const allusers=await User.find({});
        if(allusers.length > 0)
        {
            res.status(200).json(
                new ApiResponse(
                    200,
                    allusers
                )
            )
        }

    }
)

const logoutUserByAdmin=asyncHandler(
    async (req,res,next)=>{
        console.log("logout  user by  admin ", req.user);

        const user=await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    refreshToken: ""
                }
            },
            {
                new:true 
            }
        )

        console.log("after logout user ",user);

        const options={
            httpOnly: true,
            secure: true
        }

        res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                "User logged out successfully "
            )
        )
    }
)

const verifyEmail=asyncHandler(
    async (req,res,next)=>{
        const token=req.header('Authorization')?.replace('Bearer ','');
        console.log("Token", token);
        const  user=await User.findOne({verifyToken:token});
        console.log("user details ", user);
        if(user.verifyToken === token)
        {
            res.status(200).json(
                new ApiResponse(
                    200,
                    "Verified Successfully"
                )
            )
        }
    }
)


const resetPassword=asyncHandler(
    async (req,res,next)=>{
        const {newPassword, confirmNewPassword}=req.body;
        // const {id}=req.params;
        console.log("req body of reset password ", req.body);
        const token=req.header('Authorization')?.replace('Bearer ','');
        console.log("token ", token); 
        if(newPassword !== confirmNewPassword){
            return new ApiError(
                401,
                "Password Doesnot Match "
            )
        }

        const user=await User.findOne({ forgotPasswordToken:token});

        const updatedPassword=await User.findByIdAndUpdate(
            {_id:user._id},
            {
                $set:{
                    password:newPassword
                }
            },
            {
                new:true
            }
        )
        await updatedPassword.save({validateBeforeSave: false});
        res.status(200)
        .json(
            new ApiResponse(
                200,
                "Password Changed Successfully "
            )
        )

    }
)

const verifyResetPassword=asyncHandler(
    async (req,res)=>{
        const {email}=req.body;
        console.log("email ", email);
        if(!email)
        {
            return new  ApiError(
                401, 
                "email  is required"
            )
        }

        const existedUser=await User.findOne({email:email});
        console.log('existed User ', existedUser);

        if(!existedUser)
        {
            return new  ApiError(
                402,
                "User  not found "
            )
        }

        await sendEmail({email,emailType:'RESET PASSWORD',  userId:existedUser._id});

        res.status(200)
        .json(
            200,
            "Password reset link send to your  email, check your email" 
        )
    }
)

export {createUser, loginUser, logoutUser, updatePassword, getAllUsers, logoutUserByAdmin, verifyEmail, verifyResetPassword, resetPassword};



