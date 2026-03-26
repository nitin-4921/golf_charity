"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Trophy, Heart, CreditCard, Flag, TrendingUp, Users, ArrowUpRight, Award } from "lucide-react";

export default function DashboardPage() {
  const userStats = [
    { label: "My Contribution", value: 1250, prefix: "₹", icon: Heart, color: "text-pink-500" },
    { label: "Score Average", value: 74, suffix: "", icon: Flag, color: "text-primary" },
    { label: "Draw Entries", value: 5, suffix: "x", icon: Trophy, color: "text-amber-500" },
    { label: "Prize Won", value: 0, prefix: "₹", icon: Award, color: "text-secondary" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-foreground/60">Good evening, Nitin 👋. Here&apos;s your impact today.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="md">Download Report</Button>
           <Button size="md">Add New Score</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, i) => (
          <Card key={stat.label} animate={true} className="border-primary/5 hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-2 rounded-xl bg-foreground/5 ${stat.color}`}>
                    <stat.icon size={20} />
                 </div>
                 <div className="text-[10px] uppercase font-bold text-foreground/30 flex items-center gap-1">
                    Active <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                 </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-foreground/50 font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
           {/* Performance Chart Placeholder */}
           <Card className="min-h-[300px] flex flex-col">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" /> Performance Trend
                 </CardTitle>
                 <CardDescription>Your handicap progression over the last 10 games.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center border-t border-card-border/30">
                 <div className="text-sm text-foreground/40 text-center">
                    <div className="w-64 h-32 mb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
                    Chart visualization will be rendered here.
                 </div>
              </CardContent>
           </Card>

           {/* Recent Scores */}
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-lg">Recent Scores</CardTitle>
                    <CardDescription>Your last 5 tournament entries.</CardDescription>
                 </div>
                 <Button variant="ghost" size="sm" className="text-primary text-xs font-bold">View History</Button>
              </CardHeader>
              <CardContent className="px-0">
                 <div className="divide-y divide-card-border/30">
                    {[72, 75, 71, 78, 74].map((score, i) => (
                       <div key={i} className="flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                {score}
                             </div>
                             <div>
                                <p className="text-sm font-bold">Pine Valley Club</p>
                                <p className="text-[10px] text-foreground/40 uppercase font-bold">12 Mar 2026</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="text-xs font-bold text-secondary flex items-center gap-1">
                                <ArrowUpRight size={14} /> +2.1 pts
                             </div>
                             <div className="text-[10px] text-foreground/40">Handicap Adj.</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
           {/* Current Charity */}
           <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Heart size={20} className="text-pink-500" fill="currentColor" /> Charity Impact
                 </CardTitle>
                 <CardDescription>Supporting Green Earth Foundation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-4 border border-card-border">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-foreground/60">Your Contribution</span>
                       <span className="text-sm font-bold">₹249.00</span>
                    </div>
                    <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary" 
                       />
                    </div>
                    <p className="text-[10px] mt-2 text-foreground/40">Next donation scheduled for April 1st.</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                       <Users size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-bold">Community Impact</p>
                       <p className="text-[10px] text-foreground/60 leading-tight">Your sub helped plant 3 trees last month.</p>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full text-xs h-10 border-primary/20 hover:bg-primary/5">Change Charity</Button>
              </CardContent>
           </Card>

           {/* Subscription Card */}
           <Card className="bg-mesh border-primary/10 overflow-hidden relative">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" /> Membership
                 </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-extrabold mb-1">Elite Plan</div>
                 <p className="text-sm text-foreground/60 mb-6 font-medium">₹999 / month</p>
                 
                 <div className="flex flex-col gap-2">
                    <Button className="w-full h-10 text-xs">Manage Subscription</Button>
                    <div className="text-[10px] text-center text-foreground/40 font-bold uppercase mt-2">Next Draw in 4 days</div>
                 </div>
              </CardContent>
              {/* Abstract decorative shape */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-1" />
           </Card>
        </div>
      </div>
    </div>
  );
}
