
import userModel from "../models/user.models.js";

import bcrypt from "bcrypt";

import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken
} from "../utils/auth.utils.js";

/* 

@description Register an user and save the data from req.body
@param req Express.Request
@param req.body Object
@param req.body.email String
@param req.body.name String
@param req.body.password String

*/

//This is express controller 

export async function register(req, res) {

  const { email, name, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    email
  });

  if (isUserAlreadyExists) {

    return res.status(400).json({

      message: "User already exists with this email address",

      errors: [
        {
          path: "email",
          msg: "User already exists with email address"
        }
      ]//This happens after validation, when the data is valid but cannot be processed.

    });
  }

  const user = await userModel.create({

    email,
    name,

    passwordHash: await bcrypt.hash(password, 12)

  });

  const accessToken = createAccessToken({ //creating access token and putting information inside the JWT payload

    userId: user._id,
    role: user.role

  });

  const refreshToken = createRefreshToken({

    userId: user._id,
    role: user.role

  });

  res.cookie("refreshToken", refreshToken, {

    httpOnly: true

  });

  await userModel.findByIdAndUpdate(user._id,{
    refreshToken // Storing refresh token in the DB
  })
  res.status(201).json({

    message: "User registered successfully",

    data: {

      user: {

        email: user.email,
        name: user.name,
        id: user._id

      },

      accessToken

    }

  });

}


/* @description Login a user and create new set of accessToken and  refreshToken
@param req.body.email String
@param req.body.password String
*/
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password"
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password"
    });
  }

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role
  });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role
  });

  await userModel.findOneAndUpdate(
    {
      email
    },
    {
      refreshToken
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true
  });

  res.status(200).json({
    message: "User Logged In successfully",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      accessToken
    }
  });
}

export async function refresh(req,res) {
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken){
    return res.status(401).json({
      message:"Refresh Token is required"
    })
  }

  try {
const decoded = readRefreshToken(refreshToken)
const {userId,role}= decoded
const user = await userModel.findById(userId)


//if the refresh token is not same as the refreshtoken of the user saved in our DB then

if(refreshToken!=user.refreshToken){
  await userModel.findByIdAndUpdate(user._id,{
    refreshToken:null,
    //isAccountFreeze:true   if u want the refresh token is not same to freeze the account so 
  })

  return res.status(401).json({
    message:"Refresh Token mismatch"
  })
}

//If refreshToken of user and in the DB matches then

const accessToken = createAccessToken({
  userId,role
})

const newRefreshToken =  createRefreshToken({
  userId,role
})

await userModel.findByIdAndUpdate(user._id,{
  refreshToken:newRefreshToken
})

res.cookie("refreshToken",newRefreshToken),{
  httpOnly:true
}

res.status(200).json({
  message:"Tokens rotated successfully",
  data:{
    user:{
      email:user.email,
      name:user.name,
      id:user._id
    },
    accessToken
  }
})
  } catch (error) {
    return res.status(401).json({
      message:"Invalid Refresh Token"
    })
  }
}

export async function getMe(req,res){
  const {userId,role}= req.user
  const user = await userModel.findById(userId)
  res.status(200).json({
    message:"User Data fetch Successfully",
    data:{
      user:{
        email:user.email,
        name:user.name,
        id:user._id
      },
      accessToken
    }
  })
}