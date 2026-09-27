
import userModel from "../models/user.models.js";

import bcrypt from "bcrypt";

import {
  createAccessToken,
  createRefreshToken
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

