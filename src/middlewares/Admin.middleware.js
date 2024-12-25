import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js';
const checkAdmin= async (req, res, next) => {
    const token= req.header('Authorization')?.replace('Bearer ', '');
    console.log("access token secret ",process.env.ACCESS_TOKEN_SECRET);
    console.log("admin token ", token);
    if(!token){
        return res.status(401).send('Access Denied');
    }
    const  user= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const adminUser = await User.findById(user._id);

    console.log("admin user ", adminUser);

    console.log("admin user ", user);

    if(adminUser?.isAdmin){
        next();
    } else {
        res.status(403).send('You are not authorized to access this resource');
    }
}


export default checkAdmin;  