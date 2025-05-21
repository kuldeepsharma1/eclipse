import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function VerificationSent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We&apos;ve sent you a verification link to your email address. Please click the link to verify your account.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            If you don&apos;t see the email, check your spam folder.
          </p>
          <Link 
            href="/auth/login" 
            className="mt-6 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Return to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
