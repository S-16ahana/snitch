import app from "./app/app.js";
import {connectDB} from './config/db.js'

await connectDB();
app.listen("3000",()=>{
  console.log("Sever is running at port number 3000")
})