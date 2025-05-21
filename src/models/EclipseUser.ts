import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: "user" },
  image: { type: String },
  authProviderId: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  verificationTokenExpiry: { type: Date, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordTokenExpiry: { type: Date, select: false },
});

export const EclipseUser = mongoose.models?.EclipseUser || mongoose.model("EclipseUser", userSchema);
