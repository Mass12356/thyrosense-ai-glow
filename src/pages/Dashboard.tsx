import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  TrendingUp,
  Zap,
  ChevronRight,
  Scan,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { getDashboardSummary } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-1/2 bg-muted rounded mb-3" />
      <div className="h-8 w-1/3 bg-muted rounded" />
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
    Low: { color: "text-neon-green", bg: "risk-low-bg", icon: CheckCircle },
    Moderate: { color: "text-neon-yellow", bg: "risk-moderate-bg", icon: AlertTriangle },
    High: { color: "text-neon-red", bg: "risk-high-bg", icon: AlertTriangle },
  };
  const m = map[level] || map.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${m.color} ${m.bg}`}>
      <m.icon size={11} /> {level}
    </span>
  );
}

function HealthScoreRadial({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#facc15" : "#ef4444";

  return (
    <div className="flex items-center justify-center">
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={10} />
        <motion.circle
          cx={70} cy={70} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-display font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 border border-border text-xs">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary
  });

  const summary: DashboardSummary = useMemo(() => {
    return data || {
      user: {
        name: "User",
        email: "",
        lastScan: "N/A",
        totalScans: 0,
        healthScore: 0,
        riskLevel: "Low",
        doctor: "",
        location: ""
      },
      tshTrendData: [],
      monthlyScanData: [],
      riskDistributionData: [],
      recentScans: [],
      aiInsights: []
    };
  }, [data]);

  const userProfile = summary.user;
  const liveScore = userProfile.healthScore || 0;
  const tshTrendData = summary.tshTrendData;
  const monthlyScanData = summary.monthlyScanData;
  const riskDistributionData = summary.riskDistributionData;
  const scanHistory = summary.recentScans;
  const aiInsights = summary.aiInsights;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {userProfile.name.split(" ")[0]} · Last scan:{" "}
            <span className="text-primary">{userProfile.lastScan}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 glass px-3 py-2 rounded-lg border border-primary/20 text-xs text-primary">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          Live Monitoring
        </div>
      </motion.div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Risk Level */}
          <div className="glass-card-hover rounded-2xl p-5 border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <Shield2 />
            </div>
            <RiskBadge level={userProfile.riskLevel} />
            <p className="text-xs text-muted-foreground mt-2">Based on latest scan</p>
          </div>

          {/* Health Score */}
          <div className="glass-card-hover rounded-2xl p-5 border relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Health Score</span>
              <Activity size={16} className="text-neon-green" />
            </div>
            <div className="text-4xl font-display font-bold text-neon-green">{liveScore}</div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                animate={{ width: `${liveScore}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-neon-green"
                style={{ boxShadow: "0 0 8px hsl(142 76% 50% / 0.6)" }}
              />
            </div>
            <p className="text-xs text-neon-green mt-1">Excellent</p>
          </div>

          {/* TSH Level */}
          <div className="glass-card-hover rounded-2xl p-5 border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">TSH Level</span>
              <TrendingUp size={16} className="text-neon-blue" />
            </div>
            <div className="text-4xl font-display font-bold text-foreground">2.2</div>
            <p className="text-xs text-muted-foreground mt-1">mIU/L · Normal range</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-neon-green">
              <CheckCircle size={11} /> Within 0.4–4.0 mIU/L
            </div>
          </div>

          {/* Total Scans */}
          <div className="glass-card-hover rounded-2xl p-5 border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Scans</span>
              <Scan size={16} className="text-neon-purple" />
            </div>
            <div className="text-4xl font-display font-bold text-foreground">{userProfile.totalScans}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime scans</p>
            <p className="text-xs text-neon-purple mt-1">+2 this month</p>
          </div>
        </motion.div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* TSH T3 T4 Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Hormone Trends</h3>
              <p className="text-xs text-muted-foreground">TSH, T3, T4 over 8 months</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-blue rounded" /> TSH</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-purple rounded" /> T3</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-cyan rounded" /> T4</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tshTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="TSH" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="T3" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="T4" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: "#06b6d4", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health Score Radial + Risk Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center"
        >
          <h3 className="font-display font-semibold text-foreground mb-1 self-start">Health Score</h3>
          <p className="text-xs text-muted-foreground mb-4 self-start">Real-time composite</p>
          <div className="relative">
            <HealthScoreRadial score={liveScore} />
          </div>
          <div className="mt-4 text-center">
            <div className="text-xs text-muted-foreground">Trend ↑ +3 pts this week</div>
            <div className="flex gap-2 mt-2 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">Excellent</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Scans Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-1">Monthly Scans</h3>
          <p className="text-xs text-muted-foreground mb-4">Upload frequency</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyScanData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="scans" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-1">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground mb-2">Overall population</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {riskDistributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}80)` }} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-1">
            {riskDistributionData.map((d) => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">AI Insights</h3>
            <span className="ml-auto text-xs text-neon-cyan flex items-center gap-1"><Zap size={10} /> Explainable</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Feature importance for risk classification</p>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.feature}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{insight.feature}</span>
                  <span className="text-muted-foreground">{insight.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.importance}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{
                      background: insight.direction === "high"
                        ? "hsl(0 90% 60%)"
                        : insight.direction === "normal"
                        ? "hsl(217 91% 60%)"
                        : "hsl(142 76% 50%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Scan Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-foreground">Recent Scans</h3>
            <p className="text-xs text-muted-foreground">Latest diagnostic history</p>
          </div>
          <a href="/history" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View all <ChevronRight size={12} />
          </a>
        </div>
        <div className="space-y-3">
          {scanHistory.slice(0, 4).map((scan, i) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/40 transition-colors group"
            >
              <div className="relative">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                  ${scan.riskLevel === "Low" ? "bg-neon-green/15 border border-neon-green/30" :
                    scan.riskLevel === "Moderate" ? "bg-neon-yellow/15 border border-neon-yellow/30" :
                    "bg-neon-red/15 border border-neon-red/30"}`}>
                  {scan.riskLevel === "Low" ? <CheckCircle size={16} className="text-neon-green" /> :
                   scan.riskLevel === "Moderate" ? <AlertTriangle size={16} className="text-neon-yellow" /> :
                   <AlertTriangle size={16} className="text-neon-red" />}
                </div>
                {i < 3 && <div className="absolute left-1/2 -translate-x-1/2 top-9 h-3 w-px bg-border" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{scan.type}</span>
                  <span className="text-xs text-muted-foreground">{scan.id}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{scan.notes}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <RiskBadge level={scan.riskLevel} />
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">{scan.score}/100</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {scan.date}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Shield2() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(142 76% 50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
