import { Router } from "express";
import {loginValidator, registerValidator} from '../validators/auth.validator.js'
import {register,login,refresh,getMe} from '../controller/auth.controller.js'
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router()
/* 
*@POST /api/auth/register
*@param req Express req
*@param req.body={email,name,password}
*@response res.status= 201 (if successful)*/

router.post('/register',registerValidator,register)
/* 
*@POST /api/auth/login
@param req
@param req.body = {email,password}
res.status = 200
*/

router.post('/login',loginValidator,login)
export default router

/* @POST /api/auth/refresh :This API helps us to create a new RefreshToken and AccessToken and save in DB
*/

router.post('/refresh',refresh,refresh)//reads from cookies refresh token ,if the refresh token is still valid then gives new access token and otherwise gives new access token+refresh token both

/* 
@GET /api/auth/me whoever is currently logged in that user we can get using this API
*/

router.get('/me',authenticate,getMe)