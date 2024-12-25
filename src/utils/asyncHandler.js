
import { ApiError } from "./ApiError.js";


const asyncHandler=(fn)=>{
    return async (req,res,next)=>{
        try {
            await fn(req,res,next);
        } catch (error) {
            throw new ApiError(401, error);
        }
    }
}

export {asyncHandler} 
