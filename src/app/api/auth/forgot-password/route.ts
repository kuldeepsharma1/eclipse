import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { EclipseUser } from "@/models/EclipseUser";
import { generateResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await EclipseUser.findOne({ email });

    if (!user) {
      // Return success even if user not found for security
      return NextResponse.json({ 
        message: "If an account exists with this email, a password reset link will be sent" 
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({ 
      message: "If an account exists with this email, a password reset link will be sent" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
