
import mongoose,{Schema} from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema=new Schema(
    {
        username:{
            type: String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:[true, "password is required"]
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        verifyToken:String,
        verifyTokenExpiry:Date,
        forgotPasswordToken:String,
        forgotPasswordTokenExpiry:Date,
        refreshToken:String
    },
    {
        timestamps:true
    }
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password'))
    {
        return null;
    }
    this.password=await bcrypt.hash(this.password, 10);

    next();
})

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email    
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password, this.password);
}

const User=mongoose.model('User', userSchema);

export {User} 