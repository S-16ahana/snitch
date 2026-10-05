import {body,validationResult} from 'express-validator';

export const createProductValidator=[
  body("title")
       .exists().withMessage("Title is required ").bail()
       .isString().withMessage("Title must be String").bail()
       .trim()
       .isLength({min:2,max:100}).withMessage("Titlemust be between 2 to 10")
       .isAlpha("en-US", { ignore: " -" }).withMessage("Title can only have english small case and capital case character"),//Checks only english character small and capital
  body("description")
      .exists().withMessage("Description is required").bail()
      .isString().withMessage("Description must be string").bail()
      .trim()
      .isLength({min:20,max:500}).withMessage("Description Length must be between 20 to 500 characters").bail(),
  body("price.amount")
       .exists().withMessage("price amount is required").bail()
       .isFloat({min:0}).withMessage("Price amount must be a floating number and must be greater than 0 "),
  body("price.currency")
      .exists().withMessage("Currency is required").bail()
      .isString().withMessage("Currency must be a string value")
      .isIn(["INR","USD"]).withMessage("Currency must be either INR or USD"),
  body("sizes")
      .exists().withMessage("Sizes are Required").bail()
      .isArray().withMessage("Sizes must be an array of object"),
  body("sizes.*.size")
     .exists().withMessage("Size must be present in every entry of sizes array").bail()
     .isString().withMessage("Size must be a string value").bail()
     .trim()
     .isIn(['XS','S','M','L','XL','XXL']).withMessage("sizes can be of these XS,S,M,L,XL,XXL.")  ,
  body("sizes.*.stock")
      .exists().withMessage("Stock must be present in every entry of the sizes array").bail()
      .isInt({min:0}).withMessage("Stock must be a integer value"),
   (req,res,next)=>{
     const errors = validationResult(req)
     if(!errors.isEmpty()){
          return res.status(400).json({
               message:"Invalid Request",
               errors:errors.array()
          })
     }
     next()
   }
]