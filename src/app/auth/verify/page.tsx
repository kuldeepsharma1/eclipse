'use client';

import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error();
        }

        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8 space-y-4">
        {status === 'loading' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600">Email Verified!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Your email has been verified successfully.</p>
            <Link 
              href="/auth/login" 
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Click here to login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The verification link is invalid or has expired.
            </p>
            <Link 
              href="/auth/login" 
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Return to login
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
