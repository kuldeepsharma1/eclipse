"use server";

import connectDB from "@/lib/db";
import { EclipseUser } from "@/models/EclipseUser";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn, signOut } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { getSession } from "@/lib/getSession";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return someError.cause;
  }
  redirect("/");
};



const register = async (formData: FormData) => {
  const firstName = formData.get("firstname") as string;
  const lastName = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("Please fill all fields");
  }

  await connectDB();

  // existing user
  const existingUser = await EclipseUser.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 12);

  const verificationToken = generateVerificationToken();
  const verificationTokenExpiry = new Date(Date.now() + 86400000); // 24 hours

  await EclipseUser.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiry,
    authProviderType:'email'
  });

  await sendVerificationEmail(email, verificationToken);

  console.log(`User created successfully 🥂`);
  redirect("/auth/verification-sent");
};

const fetchAllUsers = async () => {
  await connectDB();
  const users = await EclipseUser.find({});
  return users;
};

export async function handleSignOut() {
    await signOut();
}
export async function getUserSession() {
    const session = await getSession();
    return session?.user ?? null; // Return user or null if not logged in
}
export { register, login, fetchAllUsers };
