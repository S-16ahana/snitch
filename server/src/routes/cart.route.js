import { Router } from "express";
import { addToCartValidator } from "../validators/cart.validator.js";
import {authenticate} from '../middlewares/auth.middlewares.js'
import {addToCart,getCart} from '../controller/cart.controller.js'
const router = Router();
/* 
@method POST
@route /api/cart
@access protected i.e, user having access token only can access it.
@description Add an product to the user cart 
*/
//req.body={productId,quantity,size}
router.post('/',authenticate,addToCartValidator,addToCart)

/* 
@method GET
@route /api/cart
@access protected
@description Get the user's cart
*/

router.get('/',authenticate,getCart)
export default router;