
import { User } from '../models/user.model.js'; 
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import ms from 'ms'
import Chance from 'chance'

const sendEmail=async ({email, emailType, userId})=>{
    // const token=await bcrypt.hash(userId.toString(), 5);
    const chance = new Chance(); 
    const token=chance.name().replace(/\s+/g, ''); 
    const expiryDate=ms('2d');

    if(emailType=='VERIFY EMAIL') 
    {
        await User.findByIdAndUpdate({_id:userId}, {verifyToken: token, verifyTokenExpiry: Date.now()+expiryDate},{new:true});
    }else if(emailType=='RESET PASSWORD'){
        await User.findByIdAndUpdate({_id:userId},{forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now()+expiryDate},{new: true});
    }

    try {
        const transport=nodemailer.createTransport({
            'service': 'gmail',

            auth:{
                user: 'shreesantadhikari4590@gmail.com',
                pass: 'rqqiecgtinbymipu'
            }
        })

        const authDetails={
            from: 'shreesantadhikari4590@gmail.com',
            to:email,   
            subject: emailType == 'VERIFY EMAIL' ? 'Verify Your Email' : 'Reset Your Password ',
            html: emailType == 'VERIFY EMAIL'  ? `<h1> Please Verify Your Email , click here : http://localhost:5173/verify/${token} </h1>`: `<h1> Please Reset  your password : click here http://localhost:5173/resetpassword/${token} </h1>`
        }

        await transport.sendMail(authDetails, (err,info)=>{
            if(!err){
                console.log(` Mail send successfully `);
            }else{
                console.log(' Error while sending Mail ', err.message);
            }
        })

    } catch (error) {
        console.log("Something went wrong ", error.message);
    }
}

export default sendEmail;