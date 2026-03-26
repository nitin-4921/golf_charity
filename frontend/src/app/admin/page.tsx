"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // If already logged in as admin, redirect straight to admin console
  React.useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.role === "admin" && localStorage.getItem("token")) {
        router.replace("/dashboard/admin");
      }
    } catch {}
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your admin credentials.");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (data.data.user.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        return;
      }
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      window.location.href = "/dashboard/admin";
    } catch (err: any) {
      setError(err.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
              <Shield size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Admin Access</h1>
            <p className="text-sm text-foreground/50">Restricted to authorised personnel only.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Admin Email"
              placeholder="admin@golfcharity.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center font-medium bg-red-500/5 border border-red-500/20 rounded-xl py-2 px-4"
              >
                {error}
              </motion.p>
            )}

            <Button className="w-full mt-2" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} /> Access Admin Console
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-foreground/30 mt-6">
            Not an admin?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              User login →
            </Link>
          </p>
        </motion.div>

        <p className="text-center mt-6 text-xs text-foreground/30">
          © 2026 GolfCharity · Admin Portal
        </p>
      </div>
    </div>
  );
}
