"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Heart, Filter, Check, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { charitiesApi } from "@/lib/api";

interface Charity {
  _id: string;
  name: string;
  description: string;
  totalDonations: number;
}

export default function CharitiesDashboardPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    charitiesApi.getAll()
      .then((res) => setCharities(res.data.charities))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSaving(true);
    setMessage("");
    try {
      await charitiesApi.select(selectedId, 10);
      setMessage("Charity updated successfully!");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const selected = charities.find((c) => c._id === selectedId);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Charity Focus</h1>
          <p className="text-foreground/60">Choose which cause your rounds will empower.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input
                placeholder="Search charities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 bg-card/40 border border-card-border rounded-xl pl-10 pr-4 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
           </div>
           <Button variant="outline" size="md" className="gap-2 shrink-0">
              <Filter size={18} /> Filters
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Charity Grid */}
         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            {loading ? (
              <div className="col-span-2 flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : filtered.length === 0 ? (
              <div className="col-span-2 text-center text-sm text-foreground/40 py-16">No charities found.</div>
            ) : filtered.map((c) => (
               <Card
                  key={c._id}
                  className={cn(
                    "cursor-pointer group hover:border-primary/20 transition-all",
                    selectedId === c._id ? "border-primary/40 bg-primary/5 ring-1 ring-primary/10" : "border-primary/5"
                  )}
                  onClick={() => setSelectedId(c._id)}
               >
                  <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-foreground/5 text-primary">
                           <Heart size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase bg-foreground/5 px-2 py-1 rounded-md">
                           Charity
                        </span>
                     </div>
                     <h3 className="text-lg font-bold mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                        {c.name} {selectedId === c._id && <Check size={16} className="text-primary" />}
                     </h3>
                     <p className="text-xs text-foreground/60 leading-relaxed mb-4">{c.description}</p>
                     <div className="flex items-center gap-4 pt-4 border-t border-card-border/30">
                        <span className="text-[10px] font-bold text-foreground/40 uppercase">
                           ₹{(c.totalDonations / 100).toFixed(0)} raised
                        </span>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Selection & Impact Details */}
         <div className="space-y-6">
            <Card className="sticky top-24 border-primary/10 bg-mesh">
               <CardHeader>
                  <CardTitle className="text-xl">Selected Foundation</CardTitle>
                  <CardDescription>Your current subscription target.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="text-center p-6 border-b border-card-border/30">
                     <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
                        <Heart size={40} />
                     </div>
                     <h2 className="text-2xl font-bold">{selected?.name ?? "None selected"}</h2>
                     <p className="text-xs text-foreground/50">Verified Partner</p>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Total raised</span>
                        <span className="font-bold text-secondary">₹{((selected?.totalDonations ?? 0) / 100).toFixed(0)}</span>
                     </div>
                     {message && (
                       <p className={`text-xs font-medium text-center ${message.includes("success") ? "text-secondary" : "text-red-500"}`}>
                         {message}
                       </p>
                     )}
                     <Button className="w-full h-12" size="lg" onClick={handleConfirm} disabled={!selectedId || saving}>
                       {saving ? "Saving..." : "Confirm Current Choice"}
                     </Button>
                     <Button variant="ghost" className="w-full text-xs gap-2 group">
                        Read Impact Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
