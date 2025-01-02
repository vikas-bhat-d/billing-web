import { Router } from "express";
import { login, register, updateGST } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const userRouter=Router();

userRouter.route('/register').post(register)
userRouter.route('/login').post(login)
userRouter.route('/').get(verifyJWT,async (req,res,next) => {
    return res.status(200).send(req.user);
})

userRouter.route("/gst").patch(verifyJWT,updateGST);