'use client';

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Invalid email address';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return;
    }

    setStatus('loading');
    setValidationError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setSuccessMessage(data.message);

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to send reset instructions');
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
        <h1 className="text-3xl font-semibold text-white">Reset Password</h1>
        <p className="mt-2 text-gray-400">
          Enter your email address below and we&apos;ll send you instructions to reset your password.
        </p>
      </motion.div>

      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="rounded-full bg-white/10 p-3 w-12 h-12 mx-auto flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-200">{successMessage}</p>
          <Link 
            href="/login" 
            className="inline-block text-sm text-white hover:text-gray-200 transition-colors"
          >
            Return to login
          </Link>
        </motion.div>
      ) : (
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <AuthInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              required
              placeholder="you@example.com"
              disabled={status === 'loading'}
              error={!!validationError}
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-gray-900 hover:bg-gray-200"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to login
            </Link>
          </div>
        </motion.form>
      )}
    </>
  );
}
