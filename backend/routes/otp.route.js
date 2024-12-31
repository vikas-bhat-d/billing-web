import { Router } from "express";
import { initializeVerification, verifyOTP } from "../controller/otp.controller.js";

export const userRouter=Router();

userRouter.route('/send').post(initializeVerification);
userRouter.route("/").post(verifyOTP)