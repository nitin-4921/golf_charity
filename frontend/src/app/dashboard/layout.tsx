"use client";

import { Sidebar } from "@/components/shared/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // -mt-20 cancels the root layout's pt-20 so we control our own spacing
    // min-h-[calc(100vh-0px)] ensures full height
    <div className="-mt-20 min-h-screen flex bg-background">
      {/* Sidebar: fixed, starts below navbar (top-20 = 80px) */}
      <div className="hidden md:block fixed top-20 bottom-0 left-0 z-40 w-64">
        <Sidebar />
      </div>

      {/* Content: padded right of sidebar, padded top to clear navbar */}
      <div className="flex-1 md:pl-64 pt-20 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
