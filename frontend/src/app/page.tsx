"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Flag, Heart, Trophy, ArrowRight, CheckCircle2, Users, TreePine, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Total Donations", value: 1254300, prefix: "₹", suffix: "+" },
    { label: "Lives Impacted", value: 45000, suffix: "" },
    { label: "Monthly Prize Pool", value: 500000, prefix: "₹" },
  ];

  const steps = [
    {
      icon: <Trophy className="text-primary" size={32} />,
      title: "Join the Club",
      description: "Subscribe to get exclusive access to score tracking and our monthly premium draw.",
    },
    {
      icon: <Flag className="text-secondary" size={32} />,
      title: "Play & Track",
      description: "Submit your golf scores. Every game you play increases your impact and visibility.",
    },
    {
      icon: <Heart className="text-pink-500" size={32} />,
      title: "Win & Give",
      description: "A portion of every subscription goes to your chosen charity. Win big, give bigger.",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero Section */}
      <section className="relative pb-12 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full glass border-primary/20 text-primary">
              The Future of Golf & Giving
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Play Golf. Win Rewards. <br />
              <span className="text-gradient">Change Lives.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 mb-10 leading-relaxed">
              Experience golf like never before. A subscription platform that rewards your passion 
              while making a measurable impact on the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Subscription <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link href="/charities">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Charities
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Counter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="glass p-8 rounded-[2.5rem] border-primary/5 shadow-2xl shadow-primary/5"
              >
                <div className="text-4xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Master Your Game, Fund the Future</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">Three simple steps to join the most exclusive and impactful golf community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Card key={i} className="group hover:border-primary/30 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="mb-6 p-4 rounded-2xl bg-foreground/5 w-fit group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-8 md:p-16 border-primary/10 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold uppercase tracking-wider text-sm mb-4 block">Emotional Impact</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Every swing feeds a child, plants a tree, or builds a dream.</h2>
                <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                  We believe that greatness on the green should translate to greatness in the world. 
                  Our platform connects your competitive spirit with verified causes that need your help.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-foreground/80 font-medium">
                    <CheckCircle2 className="text-secondary" /> Direct verification of all donations
                  </li>
                  <li className="flex items-center gap-3 text-foreground/80 font-medium">
                    <CheckCircle2 className="text-secondary" /> Real-time tracking of your individual impact
                  </li>
                  <li className="flex items-center gap-3 text-foreground/80 font-medium">
                    <CheckCircle2 className="text-secondary" /> Exclusive monthly updates from field teams
                  </li>
                </ul>
                <Button variant="secondary" size="lg">Join the Movement</Button>
              </div>
              <div className="relative">
                 {/* Visual Impact Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       <div className="aspect-square rounded-3xl bg-primary/20 flex flex-col items-center justify-center p-6 text-center">
                          <TreePine size={48} className="mb-4 text-primary" />
                          <div className="text-2xl font-bold">12,000+</div>
                          <div className="text-xs text-foreground/40 mt-1 uppercase">Trees Planted</div>
                       </div>
                       <div className="aspect-[4/5] rounded-3xl bg-secondary/20 flex flex-col items-center justify-center p-6 text-center">
                          <Users size={48} className="mb-4 text-secondary" />
                          <div className="text-2xl font-bold">5,400</div>
                          <div className="text-xs text-foreground/40 mt-1 uppercase">Meals Served</div>
                       </div>
                    </div>
                    <div className="space-y-4 mt-8">
                       <div className="aspect-[4/5] rounded-3xl bg-pink-500/10 flex flex-col items-center justify-center p-6 text-center border border-pink-500/20">
                          <Heart size={48} className="mb-4 text-pink-500" />
                          <div className="text-2xl font-bold">850</div>
                          <div className="text-xs text-foreground/40 mt-1 uppercase">Medical Aids</div>
                       </div>
                       <div className="aspect-square rounded-3xl bg-amber-500/10 flex flex-col items-center justify-center p-6 text-center border border-amber-500/20">
                          <GraduationCap size={48} className="mb-4 text-amber-500" />
                          <div className="text-2xl font-bold">120+</div>
                          <div className="text-xs text-foreground/40 mt-1 uppercase">Scholarships</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
