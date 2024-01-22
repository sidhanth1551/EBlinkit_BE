import express from "express";
import { register, login, user } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/user/:id", user);

export default router;
