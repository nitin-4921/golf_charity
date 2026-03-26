"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Heart, Globe, Users, Filter, Check, ArrowRight, TreePine, GraduationCap, ShieldCheck, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const charities = [
  { id: 1, name: "Green Earth Foundation", description: "Global reforestation and marine life protection.", icon: <TreePine />, color: "text-secondary", category: "Environment", impact: "12k trees planted" },
  { id: 2, name: "Educate Every Child", description: "Building schools and providing digital tools for education.", icon: <GraduationCap />, color: "text-primary", category: "Education", impact: "50+ schools built" },
  { id: 3, name: "Hands for Health", description: "Providing clean water and basic medical aid to rural areas.", icon: <Heart />, color: "text-pink-500", category: "Health", impact: "100k+ medical aids" },
  { id: 4, name: "Wildlife Heroes", description: "Protecting endangered species and their habitats.", icon: <Globe />, color: "text-amber-500", category: "Animals", impact: "20+ species saved" },
  { id: 5, name: "Community Kitchens", description: "Ensuring zero hunger in local urban communities.", icon: <Users />, color: "text-orange-500", category: "Food", impact: "1M+ meals served" },
  { id: 6, name: "Tech for Good", description: "Digital literacy for seniors and vocational training.", icon: <LifeBuoy />, color: "text-blue-500", category: "Technology", impact: "5k+ seniors trained" },
];

export default function CharitiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
      <div className="text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 uppercase font-geist-sans">Explore <span className="text-gradient">Impact</span></h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
             Choose the foundation that resonates with you. Your monthly subscription 
             directly funds these verified global projects.
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8">
           <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input 
                 placeholder="Search by name, cause or region..." 
                 className="w-full h-14 glass rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border-primary/10 transition-all"
              />
           </div>
           <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl gap-2 font-bold uppercase tracking-widest text-xs">
              <Filter size={20} /> Advanced Filters
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
             <Link href={`/charities/${c.id}`}>
               <Card className="group hover:border-primary/40 transition-all h-full bg-surface border-primary/5 flex flex-col overflow-hidden hover:translate-y-[-4px]">
                  <CardContent className="p-8 flex flex-col h-full">
                     <div className="flex justify-between items-start mb-6">
                        <div className={cn("p-4 rounded-2xl bg-foreground/5 group-hover:bg-primary/10 transition-colors", c.color)}>
                           {c.icon}
                        </div>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase bg-foreground/5 px-2.5 py-1 rounded-full border border-card-border">
                           {c.category}
                        </span>
                     </div>
                     <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{c.name}</h3>
                     <p className="text-sm text-foreground/60 leading-relaxed mb-8 flex-1">
                        {c.description}
                     </p>
                     
                     <div className="space-y-4">
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                           <div className="text-[10px] font-black uppercase text-secondary tracking-[0.1em] mb-1">Impact Milestone</div>
                           <p className="text-xs font-bold">{c.impact}</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-foreground/30 px-1 pt-2">
                           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-secondary" /> Verified Cause</div>
                           <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors group-hover:translate-x-1">Details <ArrowRight size={14} /></div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
             </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="glass p-12 rounded-[3rem] border-primary/10 text-center space-y-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none" />
         <h2 className="text-3xl md:text-4xl font-bold">Don&apos;t see your favorite charity?</h2>
         <p className="text-foreground/60 max-w-xl mx-auto">
            We are constantly partnering with new foundations. Nominate a verified non-profit 
            for our next vetting cycle and help us grow the impact.
         </p>
         <Button variant="secondary" size="lg" className="rounded-2xl px-12">Submit Nomination</Button>
      </div>
    </div>
  );
}
