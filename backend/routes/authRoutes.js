const express = require("express");
const {registerUser, verifyOTP,loginUser,logoutUser,resendOTP,getDashboard,sendResetLink,resetPassword} = require("../controllers/authController");
const { jwtAuthMiddlware } = require("../jwt");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/resend-otp", resendOTP);
router.get("/dashboard", jwtAuthMiddlware, getDashboard);
router.post("/send-reset-link", sendResetLink);
router.post("/reset-password", resetPassword);

module.exports = router;