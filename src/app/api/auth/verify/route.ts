import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { EclipseUser } from "@/models/EclipseUser";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await EclipseUser.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
}
