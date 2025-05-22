'use client';

import { register } from "@/actions/auth/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 shadow-2xl rounded-xl space-y-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join us by filling in your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="John"
                  disabled={isLoading}
                  className={validationErrors.firstname ? 'border-red-500' : ''}
                />
                {validationErrors.firstname && (
                  <p className="text-sm text-red-500">{validationErrors.firstname}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder="Doe"
                  disabled={isLoading}
                  className={validationErrors.lastname ? 'border-red-500' : ''}
                />
                {validationErrors.lastname && (
                  <p className="text-sm text-red-500">{validationErrors.lastname}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                disabled={isLoading}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                className={validationErrors.password ? 'border-red-500' : ''}
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                href="/auth/login" 
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}