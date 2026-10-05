import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true,
  },
   name:{
    type:String,
    required:true,
   },
   passwordHash:{
    type:String,
    required:true,
     },
     role:{
      type:String,
      default:"user",
      enum:["user","seller"]
     },
     refreshToken:{
      type:String,
           }
})

const userModel = mongoose.model("users",userSchema)

export default userModel