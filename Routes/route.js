import { Router } from "express";
import { Signup, DirectLogin, FindEmail, Sendotp, Createuser, DeleteUser } from "../Functions/functions.js";
const router = Router();
router.post("/login", DirectLogin)
router.post("/find-user", FindEmail)
router.post("/send-otp", Sendotp)
router.post("/signup", Signup)
router.post("/create-user",Createuser)
router.post("/delete-user",DeleteUser)
export default router;