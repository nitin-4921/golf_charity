"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Flag, Plus, Trash2, Calendar, ChevronRight, TrendingDown, Check, Trophy } from "lucide-react";
import { scoresApi } from "@/lib/api";

export default function ScoresPage() {
  const [scores, setScores] = useState<{_id: string; value: number; date: string}[]>([]);
  const [newScore, setNewScore] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    scoresApi.getScores()
      .then((res) => setScores(res.data.scores))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addScore = async () => {
    const val = parseInt(newScore);
    if (!val || val < 1 || val > 45) {
      setError("Score must be between 1 and 45.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await scoresApi.addScore(val, new Date().toISOString());
      setScores(res.data.scores);
      setNewScore("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add score.");
    } finally {
      setSaving(false);
    }
  };

  const removeScore = async (scoreId: string) => {
    try {
      await scoresApi.deleteScore(scoreId);
      // Refresh scores after delete
      const fresh = await scoresApi.getScores();
      setScores(fresh.data.scores);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete score.");
    }
  };

  const chartData = [...scores].reverse().map((s) => ({
    name: new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    score: s.value,
  }));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Score Management</h1>
          <p className="text-foreground/60">Track your performance and impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tracker Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Analytics Chart */}
          <Card className="p-2 border-primary/5">
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <TrendingDown size={20} className="text-primary" /> Performance Analytics
                </CardTitle>
                <CardDescription>Visualizing your recent tournament rounds.</CardDescription>
             </CardHeader>
             <CardContent className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} 
                      dy={10}
                    />
                    <YAxis 
                      hide 
                      domain={['dataMin - 5', 'dataMax + 5']} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "none", borderRadius: "12px", color: "white" }}
                      itemStyle={{ color: "#6366f1" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>

          {/* Score Entry & History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold px-2">Recent Rounds</h3>
            {error && <p className="text-sm text-red-500 px-2">{error}</p>}
            {loading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
            ) : (
            <div className="grid grid-cols-1 gap-4">
               <AnimatePresence mode="popLayout">
                  {scores.map((s, i) => (
                    <motion.div
                      key={s._id ?? i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 50 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className="group hover:border-primary/30 transition-all overflow-hidden border-primary/5">
                        <CardContent className="p-4 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex flex-col items-center justify-center font-extrabold text-primary">
                                 <span className="text-lg">{s.value}</span>
                                 <span className="text-[8px] uppercase tracking-tighter -mt-1 opacity-60">Score</span>
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm flex items-center gap-2 group-hover:text-primary transition-colors">
                                    Stableford Round <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </h4>
                                 <div className="flex items-center gap-3 text-[10px] text-foreground/40 font-bold uppercase mt-1">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={10} /> {new Date(s.date).toLocaleDateString("en-GB")}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeScore(s._id)}
                              className="text-foreground/20 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 size={16} />
                           </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {scores.length === 0 && (
                    <p className="text-center text-sm text-foreground/40 py-8">No scores yet. Add your first round!</p>
                  )}
               </AnimatePresence>
            </div>
            )}
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="space-y-8">
           <Card className="border-primary/20 sticky top-24">
              <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Plus size={20} className="text-primary" /> Add New Round
                 </CardTitle>
                 <CardDescription>Enter your latest tournament score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Input 
                   label="Stableford Score (1–45)" 
                   type="number" 
                   placeholder="e.g. 32" 
                   value={newScore}
                   onChange={(e) => setNewScore(e.target.value)}
                   min={1}
                   max={45}
                 />
                 <div className="pt-2">
                    <Button className="w-full gap-2" onClick={addScore} disabled={!newScore || saving}>
                       {saving ? "Saving..." : <><Flag size={18} /> Post Score</>}
                    </Button>
                    <p className="text-[10px] text-center mt-3 text-foreground/40 font-bold uppercase">
                       This score will be used for the next monthly draw.
                    </p>
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                        <Trophy size={20} />
                    </div>
                    <div className="text-sm font-bold">Eligibility Check</div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-foreground/60">Rounds submitted</span>
                       <span className="font-bold">{scores.length} / 5</span>
                    </div>
                    <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                       <div className="h-full bg-secondary transition-all" style={{ width: `${Math.min(scores.length / 5 * 100, 100)}%` }} />
                    </div>
                    <p className={`text-[10px] font-bold flex items-center gap-1 pt-1 ${scores.length >= 5 ? "text-secondary" : "text-amber-500"}`}>
                       {scores.length >= 5 ? <><Check size={10} /> Eligible for next draw!</> : `${5 - scores.length} more score(s) needed`}
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
