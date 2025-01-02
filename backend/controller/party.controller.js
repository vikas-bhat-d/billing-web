import asyncHandler from "../utils/asyncHandler.utils.js";
import apiResponse from "../utils/apiResponse.utils.js";
import pool from "../database/db.js";
import Party from "../model/party.model.js";

export const createParty=asyncHandler(async (req,res,next) => {
    const {name,phone_number,email,GSTIN,type,billing_address,shipping_address,to_collect,to_pay}=req.body;
    const userID=req.user?.id;

    const newParty=new Party({name,phone_number,email,GSTIN,type,billing_address,shipping_address,to_collect,to_pay,userID});

    const result=await newParty.save();

    res.status(200).send(result);

})