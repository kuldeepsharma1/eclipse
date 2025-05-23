'use client';

import { IconBrandGoogle } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function GoogleSignInButton({ isLoading }: { isLoading: boolean }) {
  const handleGoogleLogin = async () => {
    try {
      await signIn("google",{redirectTo:'/'});
    } catch {
      toast.error('Google login failed');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full bg-transparent cursor-pointer py-6 rounded-full  text-white border-white/20"
    >
      <IconBrandGoogle className="size-6 mr-2" />
    <span>  Continue with Google</span>
    </Button>
  );
}
