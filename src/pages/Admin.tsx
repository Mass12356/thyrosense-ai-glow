import { motion } from "framer-motion";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, Activity, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { getAdminReportHistory, getAdminSummary } from "@/lib/api";
import type { Report } from "@/lib/types";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 border border-border text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value.toLocaleString()}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Admin() {
  const { data: summary } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: getAdminSummary
  });
  const { data: reportData } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReportHistory
  });

  const reports = (reportData || []) as Report[];
  const monthlyScanData = summary?.monthlyScanData || [];
  const adminRiskDistribution = summary?.riskDistributionData || [];

  const statCards = useMemo(() => {
    const scanThisMonth = monthlyScanData[monthlyScanData.length - 1]?.scans || 0;
    const scores = reports.map((r) => {
      const analysis = r.analysis || {};
      const level = String(analysis.riskLevel || "Low");
      if (typeof analysis.riskScore === "number") return analysis.riskScore;
      return level.toLowerCase() === "high" ? 30 : level.toLowerCase() === "moderate" ? 60 : 85;
    });
    const avgScore = scores.length
      ? (scores.reduce((a, v) => a + v, 0) / scores.length).toFixed(1)
      : "0.0";
    const highRisk = reports.filter((r) => String(r.analysis?.riskLevel || "").toLowerCase() === "high").length;

    return [
      { label: "Total Users", value: String(summary?.totalUsers ?? 0), sub: "Platform", icon: Users, color: "text-neon-blue", glowClass: "shadow-[0_0_15px_hsl(217_91%_60%/0.3)]" },
      { label: "Scans This Month", value: String(scanThisMonth), sub: "Platform", icon: Activity, color: "text-neon-purple", glowClass: "shadow-[0_0_15px_hsl(270_80%_65%/0.3)]" },
      { label: "Avg Health Score", value: avgScore, sub: "Platform", icon: TrendingUp, color: "text-neon-green", glowClass: "shadow-[0_0_15px_hsl(142_76%_50%/0.3)]" },
      { label: "High Risk Users", value: String(highRisk), sub: "Platform", icon: AlertTriangle, color: "text-neon-red", glowClass: "shadow-[0_0_15px_hsl(0_90%_60%/0.3)]" },
    ];
  }, [monthlyScanData, reports, summary]);

  const adminUserStats = useMemo(() => {
    let cumulative = 0;
    return monthlyScanData.map((m) => {
      cumulative += m.scans;
      return { month: m.month, users: cumulative };
    });
  }, [monthlyScanData]);

  return (
    <div className="p-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-xs text-neon-purple font-semibold flex items-center gap-1">
            <Zap size={10} /> Admin
          </span>
        </div>
        <p className="text-muted-foreground text-sm">Platform-wide analytics and monitoring</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="glass-card-hover rounded-2xl p-5 border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl glass flex items-center justify-center ${card.glowClass}`}>
                <card.icon size={16} className={card.color} />
              </div>
            </div>
            <div className={`text-3xl font-display font-bold ${card.color}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-1">User Growth</h3>
          <p className="text-xs text-muted-foreground mb-4">Cumulative registered users over 8 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={adminUserStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="users" stroke="url(#userGrad)" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-1">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">All-time platform users</p>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={adminRiskDistribution}
                  cx="50%" cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {adminRiskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [Number(v).toLocaleString(), "users"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {adminRiskDistribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold text-foreground">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly uploads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-1">Upload Trends</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly scan uploads across the platform</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyScanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="scans" fill="url(#adminBarGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { label: "AI Model Accuracy", value: 97, color: "#22c55e" },
              { label: "API Uptime", value: 99.9, color: "#3b82f6" },
              { label: "Storage Used", value: 68, color: "#facc15" },
              { label: "Avg Response Time", value: 50, max: "ms", color: "#a855f7", displayVal: "50ms" },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-foreground">{m.label}</span>
                  <span className="font-semibold" style={{ color: m.color }}>
                    {m.displayVal || `${m.value}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="h-full rounded-full"
                    style={{ background: m.color, boxShadow: `0 0 8px ${m.color}60` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-xl bg-neon-green/5 border border-neon-green/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-neon-green font-semibold">All systems operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
