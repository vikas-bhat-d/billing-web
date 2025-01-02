import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createParty } from "../controller/party.controller.js";

export const partyRouter=Router();

partyRouter.route("/").post(verifyJWT,createParty);