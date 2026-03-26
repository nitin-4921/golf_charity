"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, Clock, ShieldCheck, AlertCircle, CheckCircle2, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const verificationSteps = [
  { id: 1, label: "Identity Proof", status: "approved", date: "22 Mar 2026" },
  { id: 2, label: "Round 1 Verification", status: "approved", date: "23 Mar 2026" },
  { id: 3, label: "Proof of Play (Video/Photo)", status: "pending", date: "Pending" },
  { id: 4, label: "Final Approval", status: "locked", date: "Awaiting Steps" },
];

export default function VerificationPage() {

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase border border-amber-500/20">Action Required</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight">Winner Verification</h1>
           <p className="text-foreground/60">Upload your proof to claim your prize.</p>
        </div>
        <Button variant="outline" className="gap-2">
           <Share2 size={18} /> Share Impact
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Upload Section */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-dashed border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer">
               <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
                     <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Upload Performance Proof</h3>
                  <p className="text-sm text-foreground/50 max-w-sm mx-auto mb-8">
                     Drag and drop your scorecard photo, tournament video, or any official proof of play here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                     <Button size="lg" className="px-8">Browse Files</Button>
                     <Button size="lg" variant="ghost" className="px-8 border border-card-border">Capture from Camera</Button>
                  </div>
                  <p className="text-[10px] text-foreground/30 mt-6 font-bold uppercase">Supported: JPG, PNG, MP4 (Max 50MB)</p>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="bg-foreground/5 border-primary/5">
                  <CardContent className="p-6 flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                        <AlertCircle size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Pending Review</p>
                        <p className="text-xs text-foreground/50">Round 3: Proof of Play</p>
                     </div>
                     <div className="ml-auto">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                           <Clock className="text-foreground/20" size={20} />
                        </motion.div>
                     </div>
                  </CardContent>
               </Card>
               <Card className="bg-secondary/5 border-secondary/10">
                  <CardContent className="p-6 flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Verified Status</p>
                        <p className="text-xs text-foreground/50">Level 2: Round Verified</p>
                     </div>
                     <div className="ml-auto">
                        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/20">
                           <Check size={20} />
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Steps Tracking */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <ShieldCheck size={20} className="text-primary" /> Track Progress
                  </CardTitle>
                  <CardDescription>Your verification journey.</CardDescription>
               </CardHeader>
               <CardContent className="px-0">
                  <div className="space-y-0">
                     {verificationSteps.map((step, i) => (
                        <div key={i} className={cn(
                          "flex items-start gap-4 p-5 relative border-l-2 ml-6 transition-all",
                          step.status === "approved" ? "border-secondary" : 
                          step.status === "pending" ? "border-amber-500" : "border-card-border"
                        )}>
                           <div className={cn(
                             "absolute -left-[11px] top-6 w-5 h-5 rounded-full flex items-center justify-center transition-all",
                             step.status === "approved" ? "bg-secondary text-white ring-4 ring-background" : 
                             step.status === "pending" ? "bg-amber-500 text-white ring-4 ring-background shadow-lg shadow-amber-500/30" : "bg-card/50 text-foreground/20 border border-card-border ring-4 ring-background"
                           )}>
                              {step.status === "approved" && <Check size={12} />}
                              {step.status === "pending" && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                           </div>
                           <div className="flex-1">
                              <h4 className={cn("text-sm font-bold", step.status === "locked" && "text-foreground/30")}>{step.label}</h4>
                              <p className="text-[10px] uppercase font-bold text-foreground/40 mt-1">{step.date}</p>
                           </div>
                           {step.status === "pending" && (
                              <Button size="sm" variant="ghost" className="text-primary h-8 px-2 text-[10px] font-bold">ACTION</Button>
                           )}
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
               <CardHeader>
                  <CardTitle className="text-sm">Verification Guidelines</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div className="flex gap-3 text-xs text-foreground/70">
                     <FileCheck size={16} className="shrink-0 text-primary" />
                     <span>Card must be signed by the club secretary.</span>
                  </div>
                  <div className="flex gap-3 text-xs text-foreground/70">
                     <FileCheck size={16} className="shrink-0 text-primary" />
                     <span>Video proof must show the final putt on 18th.</span>
                  </div>
                  <div className="flex gap-3 text-xs text-foreground/70 text-secondary">
                     <ShieldCheck size={16} className="shrink-0" />
                     <span className="font-bold">Prize disbursed within 48h of approval.</span>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
