import { Router } from "express";
import { Signup, DirectLogin, FindEmail, Sendotp, Createuser, DeleteUser, GiveUser, GetAllUserTest, GetAll, MarkTestAsAttempted, GetTest, GetCreatedTests, GeneratePdf } from "../Functions/functions.js";
import { CreateTest, DeletAll, EditPaper, GetAllTests } from "../Functions/functions.js";
const router = Router();
router.post("/login", DirectLogin)
router.post("/find-user", FindEmail)
router.post("/send-otp", Sendotp)
router.post("/signup", Signup)
router.post("/create-user",Createuser)
router.post("/delete-user",DeleteUser)
router.post("/give-user",GiveUser)
router.post("/create-test",CreateTest);
router.get("/get-all-tests",GetAllTests);
router.post("/edit-paper",EditPaper);
router.post("/delete-all",DeletAll);
router.get("/get-all",GetAll);
router.post("/get-userTest",GetAllUserTest)
router.post("/attempt",MarkTestAsAttempted)
router.post("/get-test",GetTest)
router.post("/get-created-test",GetCreatedTests)
router.post("/get-pdf",GeneratePdf)
export default router;