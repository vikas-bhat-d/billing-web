import User from "../model/user.model.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import apiResponse from "../utils/apiResponse.utils.js";
import pool from "../database/db.js";

const cookieOptions={
    httpOnly:true,
    secure:true
}

export const register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some((field) => field?.trim() === "")) {
        return res.status(400).send(new apiResponse(400, null, "all fields are required"))
    }

    let existedUser = await User.findByEmail(email);
    if (existedUser.id) {
        return res.status(400).send(new apiResponse(400, null, "user already exists"))
    }

    let isVerified = await User.isVerified(email);
    console.log(isVerified);
    if (!isVerified)
        return res.status(400).send(new apiResponse(400, null, "user not verified"))

    const user = new User({ username, email, password });
    const result = await user.save();
    res.status(200).send(new apiResponse(200, result, "User Registered Successfully"));
})

const verifyOTP = async (email, otp) => {
    const sql = "SELECT * FROM otp_tokens WHERE email = ? AND otp = ?";
    const [rows] = await pool.execute(sql, [email, otp]);
    if (rows.length === 0) {
        return false
    }

    const otpData = rows[0];
    if (new Date() > new Date(otpData.expires_at)) {
        return false
    }

    if (otpData.is_used) {
        return res.status(400).send(new apiResponse(400, null, "OTP has already been used"))
    }

    await pool.execute("DELETE FROM otp_tokens WHERE email=?", [email]);

    return true;
}

export const login = asyncHandler(async (req, res, next) => {
    const { email, pass, byOTP } = req.body;
    if (email.trim() == "" || pass.trim() == "")
        return res.status(400).send(new apiResponse(400, null, "all the fields are required"))
    let existedUser = await User.findByEmail(email);
    console.log(existedUser);
    if (!existedUser.id) {
        return res.status(400).send(new apiResponse(400, null, "incorrect email"))
    }
    let isVerified;
    if (byOTP === "false")
        isVerified = await existedUser.checkPassword(pass);
    else
        isVerified = await verifyOTP(email, pass);

    if (!isVerified)
        return res.status(400).send(new apiResponse(400, null, "Incorrect password or otp.. or otp is expired"))

    const accessToken = await existedUser.generateAccessToken();
    const refreshToken = await existedUser.generateRefreshToken();

    const sql = "UPDATE users SET refreshToken=? WHERE id=?;"
    await pool.execute(sql, [refreshToken, existedUser.id]);

    return res
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .status(200).send("u are logged in");


})

export const updateGST = asyncHandler(async (req, res, next) => {
    const { GSTIN } = req.body;
    const { id, email } = req.user;

    let existedUser = await User.findById(id);
    if (!existedUser.id) {
        return res.status(400).send(new apiResponse(400, null, "user not found"))
    }

    const sql = "UPDATE users SET GSTIN=? WHERE id=?";
    const result = await pool.execute(sql, [GSTIN, existedUser.id]);
    return res.status(200).send(new apiResponse(200, result, "GSTIN updated succesfully"));
})