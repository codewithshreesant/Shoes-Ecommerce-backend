
import express,{ Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createUser, getAllUsers, loginUser, logoutUser, logoutUserByAdmin, resetPassword, updatePassword, verifyEmail, verifyResetPassword } from "../controllers/user/user.controller.js";
import { jwtVerify, logoutUserVerify } from "../middlewares/auth.middleware.js";
import cors from 'cors';
import checkAdmin from "../middlewares/Admin.middleware.js";

// app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'POST') { return res.sendStatus(200); } next(); });

const router=Router();

// router.options('/create', (req, res) => { res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.send(); });

router.use(cors({
    origin:'*',
    credentials:true,
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
}));

router.route('/create').post((req, res, next) => {
  next(); 
},createUser);

router.route('/all').get(getAllUsers);

router.route('/login').post((req, res, next) => {
    next(); 
  },loginUser);

router.route('/logout').post(jwtVerify, logoutUser);

router.route('/updatepassword').post(updatePassword);

router.route('/resetpassword').post((req, res, next) => {
    next(); 
  }, resetPassword); 

router.route('/verifyresetpassword').post(verifyResetPassword);

router.route('/verifyemail').post(verifyEmail);
router.route('/admin').post(checkAdmin, (req, res) => {
    res.status(200).send('You are an admin');
}
);

router.route('/logoutUser').post(logoutUserVerify, logoutUserByAdmin)

export default router;