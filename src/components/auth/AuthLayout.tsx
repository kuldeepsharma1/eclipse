'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


interface AuthLayoutProps {
  children: React.ReactNode;
  cardClassName?: string;
}

export function AuthLayout({ children, cardClassName }: AuthLayoutProps) {
  const eclipseVariants = {
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.02, 1],
      transition: {
        duration: 5,
        ease: "easeInOut",
        repeat: 2,
      },
    },
  };
  const eclipseVariantsInner = {
    animate: {
      opacity: [0.8, 1, 0.8],
      scale: [1, 1.03, 1],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: 2,
        delay: 0.5, // Stagger animation
      },
    },
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white overflow-hidden antialiased relative">
  
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50 z-0"></div>
     
      {/* Animated Eclipse Background Effect Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[70vw] sm:h-[70vw] max-w-[900px] max-h-[900px] pointer-events-none z-0">
        <div className="relative w-full h-full">
          {/* Outermost, very diffuse and large glow */}
          <motion.div
            className="absolute inset-[-20%] sm:inset-[-25%] bg-white/5 rounded-full blur-[20rem] sm:blur-[28rem]"
            variants={eclipseVariants}
            animate="animate"
          />
          {/* Main outer corona glow */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-full blur-[14rem] sm:blur-[18rem]"
            variants={eclipseVariantsInner}
            animate="animate"
          />
          {/* Inner, brighter part of the corona */}
          <motion.div
            className="absolute inset-[25%] sm:inset-[30%] bg-white/15 rounded-full blur-[8rem] sm:blur-[10rem]"
            variants={eclipseVariants}
            animate="animate"
            style={{ animationDelay: '1s' }} // Stagger animation
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="container relative px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} // More refined easing
        >
          <Card className={cn(
            "mx-auto w-full max-w-md sm:max-w-lg",
            "backdrop-blur-xl", // Increased blur for better separation
            "bg-black/50",     // Slightly more opaque for readability
            "border border-white/15", // Slightly more prominent border
            // Refined shadow for a softer, more modern glow
            "shadow-[0_0_60px_10px_rgba(255,255,255,0.08),_0_0_25px_3px_rgba(255,255,255,0.06)]",
            "rounded-3xl", // Consistent rounding
            cardClassName
          )}>
            {/* Inner padding with a subtle inset shadow for depth */}
            <div className="p-8 sm:p-12 relative">
              {/* Optional: subtle inner glow for the content area */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl shadow-[inset_0_0_15px_rgba(255,255,255,0.03)] pointer-events-none"></div>
              {children}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
