
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
console.log(process.env.DATABASE_URI)
const connectDB=async ()=>{
    try {
        const connection=await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`);
        console.log(`Database Connected ! HOST ${connection.connection.host}`);
    } catch (error) {
        console.log(`Error occured ${error.message}`);
    }
}

export {connectDB}