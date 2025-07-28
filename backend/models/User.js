const mongoose = require("mongoose");
const { type } = require("os");
const { boolean } = require("webidl-conversions");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  isVerified:{type: Boolean , default:false},
  resetToken: { type: String },
  resetExpiry: { type: Date },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
