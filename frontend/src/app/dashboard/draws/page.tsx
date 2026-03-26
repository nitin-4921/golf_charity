"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Star, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const previousWinners = [
  { id: 1, name: "Rahul S.", amount: "₹50,000", charity: "Green Earth", date: "Feb 2026" },
  { id: 2, name: "Jessica P.", amount: "₹25,000", charity: "Educate Every Child", date: "Jan 2026" },
  { id: 3, name: "Amit K.", amount: "₹10,000", charity: "Hands for Health", date: "Dec 2025" },
];

export default function DrawsPage() {
  const [isRevealing, setIsRevealing] = useState(false);
  const [numbers, setNumbers] = useState([0, 0, 0, 0, 0]);
  const [showBalls, setShowBalls] = useState(false);

  const startReveal = () => {
    setIsRevealing(true);
    setShowBalls(true);
    setNumbers([0, 0, 0, 0, 0]);
    
    // Simulate sequential reveal
    [0, 1, 2, 3, 4].forEach((i) => {
      setTimeout(() => {
        setNumbers((prev) => {
          const next = [...prev];
          next[i] = Math.floor(Math.random() * 99) + 1;
          return next;
        });
        if (i === 4) setIsRevealing(false);
      }, (i + 1) * 800);
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-geist-sans uppercase">Monthly Draws</h1>
          <p className="text-foreground/60">Watch history happen. Win big, give back.</p>
        </div>
      </div>

      {/* Main Draw Result Card */}
      <Card className="bg-mesh border-primary/20 overflow-hidden relative min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        
        <AnimatePresence mode="wait">
          {!showBalls ? (
            <motion.div
              key="pre-draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-6"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                 <Trophy size={48} className="text-primary" />
              </div>
              <h2 className="text-3xl font-bold">March 2026 Premium Draw</h2>
              <p className="text-foreground/60 max-w-sm mx-auto uppercase font-bold tracking-widest text-xs">
                 Current Prize Pool: <span className="text-primary">₹5,00,000</span>
              </p>
              <div className="pt-4">
                 <Button size="lg" onClick={startReveal} className="gap-2 px-10 rounded-full h-14 text-lg">
                    <Play size={20} fill="currentColor" /> Watch the Draw
                 </Button>
              </div>
              <p className="text-[10px] text-foreground/40 font-bold uppercase">Open for watching from 25th March</p>
            </motion.div>
          ) : (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl"
            >
               <div className="mb-12">
                  <span className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4 block">Official Draw in Progress</span>
                  <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                     {numbers.map((num, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className={cn(
                            "w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-4xl font-black transition-all duration-500",
                            num > 0 
                              ? "bg-primary text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-110" 
                              : "glass text-foreground/20"
                          )}
                        >
                          {num > 0 ? num : "?"}
                        </motion.div>
                     ))}
                  </div>
               </div>

               {isRevealing ? (
                  <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-primary font-bold text-sm uppercase tracking-widest"
                  >
                     Revealing numbers...
                  </motion.div>
               ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                     <div className="glass p-6 rounded-3xl border-primary/20 mb-8 max-w-lg mx-auto">
                        <h4 className="font-bold text-lg mb-2">No Winner Found Yet</h4>
                        <p className="text-sm text-foreground/60">Matching 4/5 numbers? You might still be eligible for secondary prizes!</p>
                     </div>
                     <Button variant="outline" onClick={() => setShowBalls(false)} className="rounded-full">Back to Lobby</Button>
                  </motion.div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Stats Card */}
         <Card className="border-secondary/10">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Users size={20} className="text-secondary" /> Participation Stats
               </CardTitle>
               <CardDescription>How the community is growing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-[10px] text-foreground/40 uppercase font-bold">Active Subscriptions</p>
                     <p className="text-2xl font-bold">12,450</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-foreground/40 uppercase font-bold">Tickets in Draw</p>
                     <p className="text-2xl font-bold text-primary">62,250</p>
                  </div>
               </div>
               <div className="p-4 rounded-2xl bg-foreground/5 border border-card-border space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                     <span>Draw Transparency Score</span>
                     <span className="text-secondary">99.8%</span>
                  </div>
                  <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                     <div className="h-full bg-secondary w-[99.8%]" />
                  </div>
                  <p className="text-[10px] text-foreground/40 leading-tight italic">Algorithm verified by independent golf ethics board.</p>
               </div>
            </CardContent>
         </Card>

         {/* Previous Winners */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-lg">Hall of Fame</CardTitle>
                  <CardDescription>Recent lucky winners.</CardDescription>
               </div>
               <Star className="text-amber-500" fill="currentColor" size={20} />
            </CardHeader>
            <CardContent className="px-0">
               <div className="divide-y divide-card-border/30">
                  {previousWinners.map((winner) => (
                    <div key={winner.id} className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">
                             {winner.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold">{winner.name}</p>
                             <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">Shared to {winner.charity}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-primary">{winner.amount}</p>
                          <p className="text-[10px] text-foreground/40 font-bold uppercase">{winner.date}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-4">
                  <Button variant="ghost" className="w-full text-xs gap-2 group">
                     See All Past Winners <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
