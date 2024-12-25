import {v2 as cloudinary} from "cloudinary"
import dotenv from 'dotenv'
import fs from "fs"
import { ApiError } from "./ApiError.js";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async (localFilePath)=>{
    try {
        const response=await cloudinary.uploader.upload(localFilePath, 
            {
                resource_type:"auto"
            }
        )

        fs.unlink(localFilePath, (error)=>{
            if(error)
            {
                console.log("Error while deleting local File Path ");
            }else{
                console.log("File deleted successfully ");
            }
        })
        
        return response;

    } catch (error) {
        throw new ApiError(401,"Error while  uploading file on cloudinary")
    }
}


export {uploadOnCloudinary} 