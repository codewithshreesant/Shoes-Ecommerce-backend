
import express from 'express'
const router=express.Router();

import checkAdmin from "../middlewares/admin.middleware.js";
router.route('/admin').post(checkAdmin, (req, res) => {
    res.status(200).send('You are an admin');
  }
  );

export default router;