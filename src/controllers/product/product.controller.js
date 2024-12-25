import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import mongoose from 'mongoose'

const createProduct = asyncHandler(
    async (req, res, next) => {
        const { productname, price, rating, description, stock, category,color } = req.body;
        console.log("req.body ",req.body);
        if (
            [productname, price, price, rating, description, stock, category,color].some((field) => {
                // return typeof field === 'string' ? field?.trim() == "" : !field
                return field==""
            })
        ) {
            throw new ApiError(401, "all fields are required");
        }

        const imageLocalPath = req.file?.path;
        console.log("Image Local Path ", imageLocalPath);

        if (!imageLocalPath) {
            throw new ApiError(401, "image local path is required ");
        }

        const image = await uploadOnCloudinary(imageLocalPath);

        // console.log("image url ",image.url);

        const savedProduct = await Product.create(
            {
                productname,
                price: Number(price),
                rating: Number(rating),
                description,
                stock: Number(stock),
                image: image?.url,
                category,
                color
            }
        )

        const prod = await savedProduct.save();

        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    prod,
                    "Product created successfully "
                )
            )
    }
)

const getProducts = asyncHandler(
    async (req, res, next) => {
        const products = await Product.find({});

        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    products
                )
            )
    }
)

const getSingleProduct = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;

        const singleProduct = await Product.findById({ _id: id });

        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    singleProduct
                )
            )
    }
)

const updateProduct = asyncHandler(
    async (req, res, next) => {
        let { id } = req.params;
        console.log("request headers ", req.headers);
        console.log(req.body);
        let updatePro;
        let response;
        // console.log("id ", id);
        id = new mongoose.Types.ObjectId(id);
        console.log("new id ", id);
        console.log("request file ",req.file)
        const imageLocalPath=req.file?.path;
        if(!req.file)
        {
            updatePro = await Product.findByIdAndUpdate(
                { _id:  id},
                {...req.body},
                {new:true}
            )
            
        }else{
            response=await uploadOnCloudinary(imageLocalPath);
            
            updatePro = await Product.findByIdAndUpdate(
                { _id: id },
                {...req.body, image:response.url},
                {new:true}
            )
            
        }

        console.log("response url  ", response);

        // const updatePro = await Product.findByIdAndUpdate(
        //     { _id: id },
        //     {...req.body, image:response.url},
        //     {new:true}
        // )

        console.log("update product details ", updatePro);

        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    updatePro,
                    "Product Updated  Successfully "
                )
            )
    }
)

const deleteProduct=asyncHandler(
    async (req,res,next)=>{
        const {id}=req.params;
        const deletePro=await Product.deleteOne({_id:id});

        res.status(200)
        .json(
            new ApiResponse(
                200,
                deletePro,
                "Product deleted Successfully "
            )
        )
    }
)

export { createProduct, getProducts, getSingleProduct, updateProduct, deleteProduct}