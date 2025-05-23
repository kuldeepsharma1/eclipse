'use client';

import { login } from "@/actions/auth/user";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = (formData: FormData) => {
    const errors = {
      email: '',
      password: '',
    };

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Validate form
    const errors = validateForm(formData);
    if (Object.values(errors).some(error => error)) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      if (result) {
        toast.error(typeof result === 'string' ? result : 'Invalid credentials');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
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
        <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>
        <p className="mt-2 text-gray-400">Sign in to your account to continue</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <AuthDivider />

      <div className="space-y-4">
        <GoogleSignInButton isLoading={isLoading} />

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}