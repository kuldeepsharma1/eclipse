'use client';

import Link from "next/link";
import { motion } from "framer-motion";


export default function VerificationSent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="rounded-full bg-white/10 p-4 w-16 h-16 mx-auto flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Check Your Email</h1>
          <p className="text-gray-400">
            We&apos;ve sent you a verification link to your email address. 
            Please click the link to verify your account.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          If you don&apos;t see the email, check your spam folder.
        </div>

        <Link 
          href="/login" 
          className="inline-block text-white hover:text-gray-200 transition-colors"
        >
          Return to login
        </Link>
      </motion.div>
    </>
  );
}
