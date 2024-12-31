import { text } from "express";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: "vikasdbhat@gmail.com",
//     subject: "Test Email",
//     text: "nothing otp is 12345",
// };
// const result = await transporter.sendMail(mailOptions)
// console.log(result)

export const generateAndSendOTP=async(recipientEmail)=>{
    const otp=Math.floor(100000 + Math.random() * 900000);
    try {
        const mailOptions={
            from:process.env.SMTP_USER,
            to:recipientEmail,
            subject:"Verification OTP",
            text:`here is the otp to verify yourself- ${otp}`
        }
    
        const result=await transporter.sendMail(mailOptions)
        return {otp,result};
    } catch (error) {
        return {otp,result:null}
    }
    // console.log(result);
}

