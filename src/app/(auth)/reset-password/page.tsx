'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validateForm = () => {
    const errors = {
      password: '',
      confirmPassword: '',
    };

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      errors.password = 'Password must include uppercase, lowercase, number and special character';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    const errors = validateForm();
    if (errors.password || errors.confirmPassword) {
      setValidationErrors(errors);
      return;
    }

    setStatus('loading');
    setValidationErrors({ password: '', confirmPassword: '' });

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setStatus('success');
      toast.success('Password reset successful');
    } catch (error) {
      setStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
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
        <p className="mt-2 text-gray-400">Enter your new password below</p>
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
          <p className="text-gray-200">Your password has been reset successfully!</p>
          <Link 
            href="/login" 
            className="inline-block text-sm text-white hover:text-gray-200 transition-colors"
          >
            Sign in with your new password
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
            <Label htmlFor="password" className="text-gray-300">
              New Password
            </Label>
            <AuthInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationErrors(prev => ({ ...prev, password: '' }));
              }}
              required
              placeholder="••••••••"
              disabled={status === 'loading'}
              error={!!validationErrors.password}
            />
            {validationErrors.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirm New Password
            </Label>
            <AuthInput
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              required
              placeholder="••••••••"
              disabled={status === 'loading'}
              error={!!validationErrors.confirmPassword}
            />
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-gray-900 hover:bg-gray-200"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Resetting Password...' : 'Reset Password'}
          </Button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      )}
    </>
  );
}
