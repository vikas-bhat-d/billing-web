import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import pool from "./database/db.js"
import { generateAndSendOTP } from "./utils/mail.js"

dotenv.config(
    {
        path:"./.env"
    }
)



const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'));
app.use(cookieParser())

app.use('/',(err,req,res,next)=>{
    res.send(`error occured: ${err?.message}`);
})
app.get('/',async (req,res)=>{
    res.send("listeningg...")
})


import { otpRouter} from "./routes/otp.route.js"
import { userRouter } from "./routes/user.route.js"
import { partyRouter } from "./routes/party.route.js"

app.use('/verify',otpRouter)
app.use('/user',userRouter)
app.use('/party',partyRouter);

app.listen(process.env.PORT,()=>{
    console.log("Listening on port 3000")
})
