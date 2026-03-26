"use client";

import Link from "next/link";
import { Trophy, Globe, Camera, Mail, Layout } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/30 backdrop-blur-xl border-t border-card-border pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="p-1.5 rounded-lg bg-primary text-white">
                <Trophy size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Golf<span className="text-primary">Charity</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/50 leading-relaxed mb-6">
              Empowering surfers, one swing at a time. The world's first premium golf subscription 
              that puts the planet first.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-foreground/40 hover:text-primary transition-colors"><Globe size={20} /></Link>
              <Link href="#" className="text-foreground/40 hover:text-primary transition-colors"><Camera size={20} /></Link>
              <Link href="#" className="text-foreground/40 hover:text-primary transition-colors"><Layout size={20} /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/draws" className="hover:text-primary transition-colors">Monthly Draws</Link></li>
              <li><Link href="/charities" className="hover:text-primary transition-colors">Charity Search</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Impact & Trust</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="glass p-6 rounded-2xl border-primary/10">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">Newsletter</h4>
            <p className="text-xs text-foreground/50 mb-4 leading-relaxed">
              Get monthly impact reports and draw announcements.
            </p>
            <div className="flex gap-2">
              <input 
                placeholder="Email" 
                className="w-full h-10 bg-white/5 dark:bg-black/20 border border-card-border rounded-lg px-3 text-xs focus:outline-none"
              />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-all">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-card-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
              © 2026 GolfCharity HQ. All Rights Reserved.
           </p>
           <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> System Status: All Systems Operational
           </div>
        </div>
      </div>
    </footer>
  );
}
