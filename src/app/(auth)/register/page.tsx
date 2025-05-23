'use client';

import { register } from "@/actions/auth/user";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

// Define Zod schema for form validation
const registerSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Convert FormData to object for Zod validation
    const formValues = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate with Zod
    const result = registerSchema.safeParse(formValues);
    if (!result.success) {
      const errors = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
      };
      
      result.error.issues.forEach((issue) => {
        if (issue.path[0] in errors) {
          errors[issue.path[0] as keyof typeof errors] = issue.message;
        }
      });
      
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-semibold text-white">Create Account</h1>
        <p className="mt-2 text-gray-400">Join us by filling in your details below</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname" className="text-gray-300">
              First Name
            </Label>
            <AuthInput
              id="firstname"
              name="firstname"
              type="text"
              placeholder="John"
              disabled={isLoading}
              error={!!validationErrors.firstname}
            />
            {validationErrors.firstname && (
              <p className="text-sm text-red-500">{validationErrors.firstname}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname" className="text-gray-300">
              Last Name
            </Label>
            <AuthInput
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Doe"
              disabled={isLoading}
              error={!!validationErrors.lastname}
            />
            {validationErrors.lastname && (
              <p className="text-sm text-red-500">{validationErrors.lastname}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email Address
          </Label>
          <AuthInput
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            error={!!validationErrors.email}
          />
          {validationErrors.email && (
            <p className="text-sm text-red-500">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">
            Password
          </Label>
          <AuthInput
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            error={!!validationErrors.password}
          />
          {validationErrors.password && (
            <p className="text-sm text-red-500">{validationErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-gray-900 hover:bg-gray-200"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <AuthDivider />

      <div className="space-y-4">
        <GoogleSignInButton isLoading={isLoading} />

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}