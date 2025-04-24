import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="text-center max-w-lg">
        <div className="relative inline-block mb-8">
          <AlertCircle className="w-20 h-20 text-white opacity-90" />
          <span className="absolute -top-2 -right-2 text-2xl font-bold text-white">!</span>
        </div>
        <h1 className="text-8xl font-extrabold text-white tracking-tight mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Oops, Page Missing</h2>
        <p className="text-lg text-gray-300 mb-10">
          The page you’re seeking isn’t here. Dive back into Eclipse’s exclusive collection.
        </p>
        <Link href="/">
          <Button
            className="bg-white text-black hover:bg-gray-200 px-10 py-3 text-lg font-semibold rounded-none border-2 border-white"
            aria-label="Return to homepage"
          >
            Explore Eclipse
          </Button>
        </Link>
      </div>
    </div>
  );
}