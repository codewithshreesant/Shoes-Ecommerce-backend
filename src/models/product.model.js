
import mongoose,{Schema} from "mongoose";

const productSchema=new Schema(
    {
        productname:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        rating:{
            type:Number
        },
        image:{
            type:String
        },
        stock:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            required:true   
        },
        color:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

const Product=mongoose.model('Product', productSchema); 

export {Product} 