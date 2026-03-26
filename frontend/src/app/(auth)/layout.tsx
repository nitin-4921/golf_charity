"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="p-2 rounded-xl bg-primary text-white group-hover:scale-110 transition-transform">
              <Trophy size={28} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Golf<span className="text-primary">Charity</span>
            </span>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-[2.5rem] p-8 md:p-10 border-primary/10 shadow-2xl"
        >
          {children}
        </motion.div>
        
        <p className="text-center mt-8 text-sm text-foreground/40">
          © 2026 GolfCharity. All rights reserved. <br />
          Built with love for the game and the world.
        </p>
      </div>
    </div>
  );
}
