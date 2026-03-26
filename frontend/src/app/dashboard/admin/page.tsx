"use client";

import * as React from "react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Heart, Trophy, Search, MoreHorizontal, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const users = [
  { id: 1, name: "Nitin Sharma", email: "nitin@example.com", plan: "Elite", impact: "₹2,450", status: "Verified" },
  { id: 2, name: "Ali Ahmed", email: "ali@example.com", plan: "Core", impact: "₹499", status: "Pending" },
  { id: 3, name: "Sara Khan", email: "sara@example.com", plan: "Legacy", impact: "₹12,500", status: "Verified" },
];

import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  React.useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      router.push("/admin-login");
    }
  }, [router]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-foreground/60">Manage platform growth and charity impact.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="md">Reports</Button>
           <Button size="md">Start Manual Draw</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: "Total Revenue", value: "₹4.2M", change: "+12.5%", icon: BarChart3, color: "text-primary" },
           { label: "Active Members", value: "12,450", change: "+4.2%", icon: Users, color: "text-secondary" },
           { label: "Donated", value: "₹1.1M", change: "+18.3%", icon: Heart, color: "text-pink-500" },
           { label: "Prizes Paid", value: "₹850k", change: "+5.1%", icon: Trophy, color: "text-amber-500" },
         ].map((stat, i) => (
           <Card key={i} className="border-primary/5">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-2 rounded-xl bg-foreground/5", stat.color)}>
                       <stat.icon size={20} />
                    </div>
                    <div className="text-[10px] font-bold text-secondary flex items-center gap-1">
                       <ArrowUpRight size={14} /> {stat.change}
                    </div>
                 </div>
                 <div className="text-2xl font-bold mb-1">{stat.value}</div>
                 <div className="text-xs text-foreground/40 font-bold uppercase tracking-wider">{stat.label}</div>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card className="border-primary/10 overflow-hidden">
         <CardHeader className="flex flex-row items-center justify-between border-b border-card-border md:px-8">
            <div className="flex gap-8">
               {["Users", "Draws", "Charities"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={cn(
                      "text-sm font-bold uppercase tracking-widest pb-4 border-b-2 transition-all",
                      activeTab === tab.toLowerCase() ? "border-primary text-primary" : "border-transparent text-foreground/40"
                    )}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            <div className="relative w-64 hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={16} />
               <input 
                 placeholder="Search entries..." 
                 className="w-full h-9 bg-foreground/5 border border-card-border rounded-lg pl-9 text-xs focus:outline-none"
               />
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-foreground/[0.02] border-b border-card-border">
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-foreground/40">Name / Email</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-foreground/40">Plan</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-foreground/40">Total Impact</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-foreground/40">Status</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-foreground/40 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/30">
                     {users.map((user) => (
                        <tr key={user.id} className="hover:bg-foreground/[0.01] transition-colors group">
                           <td className="px-8 py-5">
                              <p className="text-sm font-bold group-hover:text-primary transition-colors">{user.name}</p>
                              <p className="text-xs text-foreground/40">{user.email}</p>
                           </td>
                           <td className="px-8 py-5">
                              <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                                 {user.plan}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold">{user.impact}</td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                 <div className={cn("w-2 h-2 rounded-full", user.status === "Verified" ? "bg-secondary" : "bg-amber-500")} />
                                 <span className="text-xs font-medium">{user.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                 <MoreHorizontal size={16} />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" /> Growth Analytics
               </CardTitle>
            </CardHeader>
            <CardContent className="h-48 flex items-center justify-center">
               <p className="text-xs text-foreground/40 uppercase font-black tracking-widest">Growth visualization here</p>
            </CardContent>
         </Card>
         <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Heart size={20} className="text-pink-500" fill="currentColor" /> Active Charities
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-center bg-card/50 p-3 rounded-xl border border-card-border/50">
                     <span className="text-xs font-bold">Foundation {i}</span>
                     <span className="text-xs text-secondary font-bold">12.5k Subs</span>
                  </div>
               ))}
               <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-foreground/40">View All Charities</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
