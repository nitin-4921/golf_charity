"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Loader2, ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login(email, password);

      if (data.data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        return;
      }

      // Store token and admin status
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      router.push("/dashboard/admin");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
         <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Shield size={32} />
         </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-gradient">Admin Portal</h1>
        <p className="text-foreground/60">Secure access for platform administrators.</p>
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
          label="Security Key"
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
            className="text-sm text-red-500 text-center font-medium bg-red-500/5 p-2 rounded-lg border border-red-500/10"
          >
            {error}
          </motion.p>
        )}

        <Button className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Verifying...
            </span>
          ) : (
            "Enter Console"
          )}
        </Button>
      </form>

      <div className="pt-4 flex justify-center">
         <Link href="/login" className="text-xs font-bold text-foreground/40 hover:text-primary flex items-center gap-2 transition-colors">
            <ArrowLeft size={14} /> Back to Member Login
         </Link>
      </div>
    </div>
  );
}
