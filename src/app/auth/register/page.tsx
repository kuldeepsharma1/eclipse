import { register } from "@/actions/auth/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Link from "next/link";
import { redirect } from "next/navigation";

const Register = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join us by filling in your details</p>
        </div>

        <form className="space-y-6" action={register}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="John"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Doe"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;