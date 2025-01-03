
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import AdminRouter from "./routes/admin.route.js"
import checkAdmin from "./middlewares/admin.middleware.js"
dotenv.config({
    path:'./.env'
})


const app=express();
app.use(cookieParser());
app.use(express.static('public'))

app.use(express.urlencoded({extended:true, limit:"10mb"}))

app.use(express.json({limit:"10mb"}))

app.use('/api/user', userRouter);

app.use('/api/product', productRouter);

app.use('/admin', AdminRouter)

// app.post('/admin',checkAdmin, (req, res) => {
//         res.status(200).send('You are an admin');
//     })

export {app}