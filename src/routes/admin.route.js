
import express from 'express'
const router=express.Router();

import checkAdmin from "../middlewares/admin.middleware.js";
import cors from 'cors'
router.use(cors({
    origin:'*',
    credentials:true,
    methods:['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
}));
router.route('/').post(checkAdmin, (req, res) => {
    res.status(200).send('You are an admin');
  }
);

export default router;