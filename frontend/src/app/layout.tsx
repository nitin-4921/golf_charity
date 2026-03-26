import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GolfCharity | Play. Win. Change Lives.",
  description: "The premium golf subscription platform that lets you track scores, win rewards, and support incredible charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30`}
      >
        <ThemeProvider defaultTheme="dark" storageKey="golf-theme">
          <div className="relative min-h-screen bg-background transition-colors duration-300">
            {/* Background Mesh Effect */}
            <div className="fixed inset-0 bg-mesh pointer-events-none opacity-40" />
            
            <Navbar />
            <main className="relative pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
