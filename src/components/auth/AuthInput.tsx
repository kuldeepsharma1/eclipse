'use client';

import { Input as BaseInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function AuthInput({ className, error, ...props }: AuthInputProps) {
  return (
    <BaseInput
      className={cn(
        "bg-white/5 border-white/10 text-white placeholder:text-gray-400 hover:border-white/20 focus:border-white/30 focus:ring-white/10",
        error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
}
