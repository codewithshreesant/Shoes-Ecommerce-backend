
import express,{Router} from "express"
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/product/product.controller.js";
import  cors from 'cors';
import bodyParser from "body-parser";
const app=express();
const router=Router();

router.use(cors({
    origin:'*',
    credentials:true,
    methods:['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
}));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// router.use(express.json()); // Parse JSON bodies
// router.use(express.urlencoded({ extended: true }));



router.route('/create').post(upload.single('image'), createProduct);

router.route('/products').get((req, res, next) => {
    next(); 
  },getProducts);

router.route('/products/:id').get((req, res, next) => {
    next(); 
  },getSingleProduct);

router.route('/update/:id').put(upload.single('image'),updateProduct);
// router.route('/update/:id').put(updateProduct);

router.route('/delete/:id').delete(deleteProduct);

// router.route('/delete/:id').delete(d)

export  default router;