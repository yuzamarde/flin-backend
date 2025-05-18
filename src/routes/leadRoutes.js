import express from "express";
import upload from "../utils/multer.js";
import { createLead, getAllLeads } from "../controllers/leadController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const leadRoutes = express.Router();

leadRoutes.post("/leads", upload, createLead);
leadRoutes.get("/leads", verifyToken, getAllLeads);


export default leadRoutes;
