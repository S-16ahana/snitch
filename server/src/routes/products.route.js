import { Router } from "express";
import {
  createProductValidator,
  unlistProductValidator,
  listProductValidator
} from "../validators/product.validator.js";
import {
  authenticate,
  authenticateSeller,
} from "../middlewares/auth.middlewares.js";
import {
  createProduct,
  listAllProducts,
  unlistProduct,
  listAllProductsToSeller,
  listProduct,
} from "../controller/product.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 1 * 1024 * 1024, //1MB
  },
  //fileFilter:to accept file of specific type like images,audio,video,pdf etc [image/jpeg,image/png]
});

const router = Router();

/* 
@method POST
@route /api/products/
@description creates the product and saves the data into the DB and images will be store on imageKit
@access Seller
req.body=>{title,description,price:{amt,currency},size[{size,stock},{size,stock}]}
*/

router.post(
  "/",
  //---------------check user and authenticate------------
  authenticate,
  authenticateSeller,
  //------------Check the role is seller or not -----------------

  //------------required for reading the data from req.body if the format is form-data(multipart-form-data) -----------------

  upload.array("images"),

  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));

    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));

    next();
  },

  createProductValidator,
  createProduct,
); //this api is only accessed by the seller

//authenticate is a middleware it checks for valid accesstoken and returns the userID,role

// we have another middleware that is inline middleware

/* 
@method GET
@route /api/product
@description Read all the products from the DB
@access user
*/

router.get("/", authenticate, listAllProducts);

/* 
@method GET
@route /api/product/seller
@description Read all the published products from the DB
@access seller
*/
router.get('/seller',authenticate,authenticateSeller,listAllProductsToSeller)

/* 
@method PATCH
@route /api/products/unlist/:id
@description Unlist a poduct by its ID
@access seller
*/

router.patch(
  "/unlist/:id",
  authenticate,
  authenticateSeller,
  unlistProductValidator,
  unlistProduct,
);
/* 
@method PATCH
@route /api/products/list/:id
@description list a poduct by its ID
@access seller
*/

router.patch(
  "/unlist/:id",
  authenticate,
  authenticateSeller,
  listProductValidator,
  listProduct,
  
);
export default router;
