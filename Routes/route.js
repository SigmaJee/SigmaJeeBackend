import { Router } from "express";
import { Signup, DirectLogin, FindEmail, Sendotp } from "../Functions/functions.js";
const router = Router();
router.post("/login", DirectLogin)
router.post("/find-user", FindEmail)
router.post("/send-otp", Sendotp)
router.post("/signup", Signup)
export default router;