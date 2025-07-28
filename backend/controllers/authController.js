const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { generateToken } = require("../jwt");
const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456789';


//email transport setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mauryakrish794@gmail.com",
    pass: "txsybtebdmnizthv",
  },
});

//Function for generating OTP

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

//Register user and send OTP
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user = new User({ name, email, password, otp, otpExpiry });
    await user.save();
    // Send OTP via email
    await transporter.sendMail({
      from: "mauryakrish794@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(201).json({
      message:
        "User registered successfully, please verify your email with the OTP sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(payload);
    res.status(200).json({ message: "User verified successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const {email}=req.body;
    const user = await User.findOne({email:email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: "mauryakrish794@gmail.com",
      to: email,
      subject: "Resend OTP Verification",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({
      message: "OTP resent successfully, please check your email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).json({ message: "User not verified" });

    if (user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });
     const payload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(payload);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  
  res.status(200).json({ message: "Logout successful" });
};

//dashboard
exports.getDashboard = (req, res) => {
  // In a real application, you would fetch user-specific data here
  res.status(200).json({ message: "Welcome to your dashboard" });
};

exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = generateToken({ id: user.id, email: user.email });
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: "mauryakrish794@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset link sent successfully" ,resetToken});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const {token, newPassword} = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });
    console.log(decoded);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" , details: error.message });
  }
};
