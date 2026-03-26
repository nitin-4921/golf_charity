"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Users, ShieldCheck, TreePine, CheckCircle2, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CharityDetailPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = useParams();
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 pb-32">
       <Link href="/charities" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Explorer
       </Link>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
             <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-primary text-white flex items-center justify-center shadow-2xl flex-shrink-0">
                   <TreePine size={64} />
                </div>
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase border border-secondary/20">Active Partner</span>
                       <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase border border-primary/20">Environmental</span>
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight">Green Earth Foundation</h1>
                   <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl">
                      Green Earth Foundation is a global leader in ecosystem restoration. 
                      Focused on rewilding urban spaces and protecting critical marine habitats across Southeast Asia.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-foreground/[0.02] border-primary/5">
                   <CardContent className="p-8 space-y-4">
                      <div className="p-3 rounded-2xl bg-secondary/10 text-secondary w-fit">
                         <ShieldCheck size={28} />
                      </div>
                      <h3 className="font-bold text-xl">Verified Transparency</h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                         98% of your contribution goes directly to field projects. Monthly audits verified by Deloitte.
                      </p>
                   </CardContent>
                </Card>
                <Card className="bg-foreground/[0.02] border-primary/5">
                   <CardContent className="p-8 space-y-4">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit">
                         <Globe size={28} />
                      </div>
                      <h3 className="font-bold text-xl">Global Reach</h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                         Active in over 45 countries, with 120+ ongoing restoration sites and 5,000 community volunteers.
                      </p>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <h3 className="text-2xl font-bold">Planned Impact 2026</h3>
                <div className="space-y-4">
                   {[
                     { label: "Community Forest Rewilding", total: "₹12.5M", progress: 65, icon: TreePine },
                     { label: "Ocean Plastic Collection", total: "₹8.2M", progress: 42, icon: Globe },
                     { label: "Eco-Education Workshops", total: "₹4.5M", progress: 85, icon: Users },
                   ].map((project, i) => (
                      <div key={i} className="glass p-6 rounded-[2rem] border-primary/5">
                         <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-foreground/5 rounded-xl text-primary"><project.icon size={20} /></div>
                               <span className="font-bold text-sm">{project.label}</span>
                            </div>
                            <span className="text-xs font-bold text-foreground/40">{project.total}</span>
                         </div>
                         <div className="w-full h-2 bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${project.progress}%` }}
                               transition={{ duration: 1, delay: 0.2 }}
                               className="h-full bg-primary" 
                            />
                         </div>
                         <div className="flex justify-between mt-2">
                            <span className="text-[10px] font-bold text-foreground/30 uppercase">Progress</span>
                            <span className="text-[10px] font-black text-secondary uppercase">{project.progress}%</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-8 sticky top-24">
             <Card className="bg-mesh border-primary/10">
                <CardHeader>
                   <CardTitle className="text-xl">Support this Foundation</CardTitle>
                   <CardDescription>Direct your subscription impact here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 text-center">
                      <div className="text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Elite Impact Preview</div>
                      <div className="text-3xl font-black text-secondary">5 Trees / Mo</div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                         <CheckCircle2 size={18} className="text-secondary" /> Daily project updates
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                         <CheckCircle2 size={18} className="text-secondary" /> Annual impact certificate
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                         <CheckCircle2 size={18} className="text-secondary" /> Tax benefit receipts (Sec 80G)
                      </div>
                   </div>
                   <Button className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20">Become a Patron</Button>
                   <Button variant="ghost" className="w-full h-12 text-xs gap-2 group">
                      <Share2 size={16} /> Share Foundation
                   </Button>
                </CardContent>
             </Card>

             <Card className="border-primary/5">
                <CardHeader>
                   <CardTitle className="text-sm">Partner Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/40 font-bold uppercase">Trust Rating</span>
                      <span className="text-secondary font-black">A+ / Excellent</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/40 font-bold uppercase">Years Active</span>
                      <span className="font-black">12 Years</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground/40 font-bold uppercase">Funding Target</span>
                      <span className="text-primary font-black">₹25,000,000</span>
                   </div>
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
}
