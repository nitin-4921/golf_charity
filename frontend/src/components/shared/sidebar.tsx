"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Flag,
  Trophy,
  Heart,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";

const userMenuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scores", href: "/dashboard/scores", icon: Flag },
  { name: "Monthly Draws", href: "/dashboard/draws", icon: Trophy },
  { name: "Charity Focus", href: "/dashboard/charities", icon: Heart },
  { name: "Verification", href: "/dashboard/verification", icon: ShieldCheck },
];

const adminMenuItems = [
  { name: "Admin Console", href: "/dashboard/admin", icon: Shield },
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scores", href: "/dashboard/scores", icon: Flag },
  { name: "Monthly Draws", href: "/dashboard/draws", icon: Trophy },
  { name: "Charity Focus", href: "/dashboard/charities", icon: Heart },
  { name: "Verification", href: "/dashboard/verification", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<StoredUser | null>(null);

  React.useEffect(() => {
    const checkUser = () => {
      const storedUser = getUser();
      setUser(storedUser);
    };
    
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;
  const roleLabel = user?.role === "admin" ? "Administrator" : user?.subscriptionPlan ? `${user.subscriptionPlan} Plan` : "Member";

  return (
    <div className="w-64 h-full flex flex-col border-r border-card-border bg-card/30 backdrop-blur-xl overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-card-border/50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-primary text-white group-hover:scale-110 transition-transform">
            <Trophy size={18} />
          </div>
          <span className="font-bold tracking-tight text-foreground">
            Golf<span className="text-primary">Charity</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              )}>
                <item.icon className={cn("mr-3 h-5 w-5 shrink-0", isActive ? "text-white" : "text-foreground/40 group-hover:text-foreground")} />
                {item.name}
                {isActive && (
                  <motion.div layoutId="active-pill" className="ml-auto">
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4 border-t border-card-border">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              {user?.role === "admin" ? <Shield size={18} /> : <User size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">
                {user?.name ?? "Loading..."}
              </p>
              <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-wider">
                {roleLabel}
              </p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-xs" size="sm">
            <Settings size={14} /> Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/5 mt-1"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut size={14} /> Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
