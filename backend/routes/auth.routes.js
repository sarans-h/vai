import express from "express";
import { signup, signin, signout, getUser, getPLHistory, addDummyData } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/me", verifyToken, getUser);
router.get('/pl-history', verifyToken, getPLHistory); // New route for P/L history
router.post('/add-dummy-data', verifyToken, addDummyData); // New route for adding dummy data

// router.post("/google", google);

export default router;




