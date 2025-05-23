'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; 
import styles from './verify.module.css'

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

    <>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }} 
        className="space-y-6 text-center" 
      >
        {status === 'loading' && (
          <div>
            <h1 className="text-3xl font-semibold text-white mb-3">
              Verifying your email
              <span className={`inline-block ${styles.dot}`}>.</span>
              <span className={`inline-block ${styles.dot}`}>.</span>
              <span className={`inline-block ${styles.dot}`}>.</span>
            </h1>

            <p className="text-zinc-400">Please wait while we verify your email address. This may take a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-3">Email Verified!</h1>
            <p className="text-zinc-400 max-w-sm mx-auto text-balance">Your email has been verified successfully. You can now log in.</p>
            <Link
              href="/login"
              className="mt-6 inline-block px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 shadow-lg text-lg font-medium"
            >
              Click here to login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h1 className="text-3xl font-bold text-red-400 mb-3">Verification Failed</h1>
            <p className="text-zinc-400 max-w-sm mx-auto text-balance">
              The verification link is invalid or has expired. Please try again or request a new link.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-300 shadow-lg text-lg font-medium"
            >
              Return to login
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}
