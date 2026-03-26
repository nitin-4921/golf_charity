"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trophy, CreditCard, ChevronRight, ChevronLeft, Check, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authApi, charitiesApi } from "@/lib/api";

const charities = [
  { id: 1, name: "Green Earth Foundation", description: "Reforestation and climate action.", icon: "🌱" },
  { id: 2, name: "Educate Every Child", description: "Providing quality education to underserved communities.", icon: "📚" },
  { id: 3, name: "Hands for Health", description: "Medical aid and clean water projects.", icon: "🩺" },
  { id: 4, name: "Animal Rescue Network", description: "Saving and rehabilitating wildlife.", icon: "🐾" },
  { id: 5, name: "Food for Futures", description: "Eradicating hunger in school children.", icon: "🍎" },
  { id: 6, name: "Tech for Good", description: "Digital literacy for seniors.", icon: "💻" },
];

const plans = [
  { id: "basic", name: "Core", price: "₹499", description: "Monthly draw entry & score tracking", impact: "Helps 2 children / month" },
  { id: "premium", name: "Elite", price: "₹999", description: "2x draw entries & priority support", impact: "Plants 5 trees / month" },
  { id: "platinum", name: "Legacy", price: "₹2499", description: "5x draw entries & exclusive events", impact: "Feeds a village for a day" },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dbCharities, setDbCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await charitiesApi.getAll();
        if (data.success && data.data.charities.length > 0) {
          setDbCharities(data.data.charities);
        }
      } catch (err) {
        console.error("Failed to fetch charities:", err);
      }
    };
    fetchCharities();
  }, []);

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSignup = async () => {
    if (!selectedPlan) {
      setError("Please select a plan to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Only pass charityId if it's a real MongoDB ObjectId (24 hex chars)
      const charityId =
        selectedCharity && /^[a-f\d]{24}$/i.test(selectedCharity)
          ? selectedCharity
          : undefined;

      const data = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        charityId,
        charityContributionPercentage: 10,
      });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              step >= s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-card/50 text-foreground/40 border border-card-border"
            )}>
              {step > s ? <Check size={16} /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-0.5 mx-2 bg-card-border", step > s && "bg-primary")} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={step}>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide">Create Account</h2>
                <p className="text-sm text-foreground/60">Let&apos;s start with the basics.</p>
              </div>
              <div className="space-y-4">
                <Input 
                  label="Full Name" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  label="Email" 
                  placeholder="john@example.com" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input 
                  label="Password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                
                {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}
              </div>
              <Button className="w-full" size="lg" onClick={nextStep}>
                Continue <ChevronRight className="ml-2" size={20} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Select Charity</h2>
                <p className="text-sm text-foreground/60">Who will your plays support?</p>
              </div>
              
              <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                  <input 
                    placeholder="Search charities..." 
                    className="w-full h-11 bg-card/50 border border-card-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {(dbCharities.length > 0 ? dbCharities : charities).map((c: any) => (
                  <div
                    key={c._id || c.id}
                    onClick={() => setSelectedCharity(c._id || c.id.toString())}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4",
                      selectedCharity === (c._id || c.id.toString())
                        ? "bg-primary/10 border-primary shadow-sm" 
                        : "bg-surface border-card-border hover:border-primary/40"
                    )}
                  >
                    <span className="text-2xl">{c.icon || "🎗️"}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className="text-xs text-foreground/50 line-clamp-1">{c.description}</p>
                    </div>
                    {selectedCharity === (c._id || c.id.toString()) && <Check className="text-primary" size={20} />}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 pt-2">
                <Button variant="ghost" className="flex-1" onClick={prevStep}>
                  <ChevronLeft className="mr-2" size={20} /> Back
                </Button>
                {error && <p className="text-xs text-red-500 font-medium text-center mb-2">{error}</p>}
                <Button className="flex-[2]" onClick={nextStep} disabled={!selectedCharity}>
                  Continue <ChevronRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Choose Plan</h2>
                <p className="text-sm text-foreground/60">Pick a contribution that works for you.</p>
              </div>

              <div className="space-y-3">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                      selectedPlan === p.id 
                        ? "bg-primary/10 border-primary shadow-sm" 
                        : "bg-surface border-card-border hover:border-primary/40"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{p.name}</h4>
                        <p className="text-xs text-foreground/50">{p.description}</p>
                      </div>
                      <div className="text-lg font-bold text-primary">{p.price}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-card-border/50 text-[10px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                      <Heart size={10} fill="currentColor" /> {p.impact}
                    </div>
                    {selectedPlan === p.id && <Check className="absolute top-2 right-2 text-primary" size={16} />}
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <div className="text-[10px] uppercase font-bold text-foreground/40 mb-1">Impact Preview</div>
                <p className="text-xs text-foreground/70">
                  Your subscription will help your chosen charity make a real difference every single month.
                </p>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 text-center font-medium bg-red-500/5 border border-red-500/20 rounded-xl py-2 px-4"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={prevStep} disabled={loading}>
                  <ChevronLeft className="mr-2" size={20} /> Back
                </Button>
                <Button
                  className="flex-[2]"
                  disabled={!selectedPlan || loading}
                  onClick={handleSignup}
                >
                  {loading ? "Creating Account..." : "Complete Signup"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm text-foreground/60">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
