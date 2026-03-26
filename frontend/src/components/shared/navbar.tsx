"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Menu, X, Sun, Moon, LogOut, LayoutDashboard, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { getUser, logout, isLoggedIn } from "@/lib/auth";
import type { StoredUser } from "@/lib/auth";

const navLinks = [
  { name: "How it Works", href: "/#how-it-works" },
  { name: "Charities", href: "/charities" },
  { name: "Draws", href: "/draws" },
  { name: "Impact", href: "/#impact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<StoredUser | null>(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Read auth state after mount (avoids hydration mismatch)
  React.useEffect(() => {
    const check = () => {
      setLoggedIn(isLoggedIn());
      setUser(getUser());
    };
    check();
    // Re-check on storage changes (login/logout in another tab)
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, [pathname]); // re-run on route change so it updates after login redirect

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "var(--card-bg)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid var(--card-border)"]
  );

  // Hide navbar entirely on dashboard pages (dashboard has its own sidebar)
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  if (isDashboard) return null;

  return (
    <motion.nav
      style={{ backgroundColor, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary text-white group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Golf<span className="text-primary">Charity</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-all"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {loggedIn && user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-card-border">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-red-400 hover:text-red-500 hover:bg-red-500/5" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/70"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/70"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden glass border-t border-card-border"
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-foreground/70 hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {loggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-red-400 hover:text-red-500"
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                >
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};
