import {body, validationResult} from 'express-validator'

export const registerValidator = [
  body('email')
  .exists().withMessage("Email is required").bail()
  .trim()
  .isEmail().withMessage("Enter valid Email Address"),
  body('name')
  .exists().withMessage("Name is required").bail()
  .trim()
  .isLength().withMessage("Name must be between 2 to 50 characters "),
   body('password')
  .exists().withMessage("Password is Required").bail()
 
  .isString().withMessage("password is required ")
   .trim()
   .isLength({min:6}).withMessage("Password be minimum 6 characters Long"),
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


export const loginValidator = [
  body("email")
      .exists().withMessage("Email is Required").bail()
      .isString().withMessage("Email must be a string value").bail()
      .trim()
      .isEmail().withMessage("Enter a valid Email"),

  body("password")
       .exists().withMessage("Password is Required").bail()
       .isString().withMessage("Password must be a String Value").bail()
       .trim()
       .isLength({min:6}).withMessage("Password atleast 6 character long"),
       (res,req,next)=>{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
          return res.status(400).json({
            message:"Invalid Data",
            errors:errors.array()
          })
        }

        next()
       }
]