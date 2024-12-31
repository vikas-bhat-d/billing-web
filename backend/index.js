import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import pool from "./database/db.js"
import { userRouter } from "./routes/otp.route.js"
dotenv.config()


const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'));

app.use('/',(err,req,res,next)=>{
    res.send(`error occured: ${err?.message}`);
})
app.get('/',(req,res)=>{
    res.send("lisetning..")
})

app.use('/verify',userRouter)

app.listen(process.env.PORT,()=>{
    console.log("Listening on port 3000")
})
