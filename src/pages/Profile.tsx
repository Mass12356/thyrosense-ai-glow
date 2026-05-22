import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Droplets, Calendar, Edit3, Save, X, Activity, Scan } from "lucide-react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from "recharts";
import { getDashboardSummary, getMe, getReportHistory } from "@/lib/api";
import type { Report } from "@/lib/types";

const MiniTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload?.length) {
    return <div className="glass-card rounded-lg px-2 py-1 text-xs text-primary border border-border">{payload[0].value}</div>;
  }
  return null;
};

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary
  });
  useQuery({
    queryKey: ["me"],
    queryFn: getMe
  });
  const { data: reportData } = useQuery({
    queryKey: ["report-history"],
    queryFn: getReportHistory
  });

  const profileSeed = summary?.user || {
    name: "User",
    email: "",
    age: 0,
    gender: "",
    bloodType: "",
    lastScan: "N/A",
    totalScans: 0,
    healthScore: 0,
    riskLevel: "Low",
    doctor: "",
    location: ""
  };

  const [profile, setProfile] = useState(profileSeed);
  const [draft, setDraft] = useState(profileSeed);

  useEffect(() => {
    setProfile(profileSeed);
    setDraft(profileSeed);
  }, [summary]);

  const latestMetrics = useMemo(() => {
    const reports = (reportData || []) as Report[];
    const latest = reports[0];
    const analysis = latest?.analysis || {};
    return {
      tsh: analysis.tsh || 0,
      t3: analysis.t3 || 0,
      t4: analysis.t4 || 0
    };
  }, [reportData]);

  const healthMetricsHistory = useMemo(() => {
    const reports = (reportData || []) as Report[];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return reports.slice(0, 6).reverse().map((report) => {
      const analysis = report.analysis || {};
      const riskLevel = String(analysis.riskLevel || "Low");
      const score = typeof analysis.riskScore === "number"
        ? analysis.riskScore
        : riskLevel.toLowerCase() === "high"
          ? 30
          : riskLevel.toLowerCase() === "moderate"
            ? 60
            : 85;
      const date = new Date(report.analyzedDate || report.createdAt || Date.now());
      return { date: monthNames[date.getMonth()], score };
    });
  }, [reportData]);

  const save = () => {
    setProfile(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your health profile and settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 flex flex-col items-center text-center"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-blue-purple flex items-center justify-center text-3xl font-display font-bold text-white shadow-lg">
              {profile.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-neon-green border-2 border-card" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground mb-1">{profile.email}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin size={11} /> {profile.location}
          </p>

          <div className="mt-4 w-full border-t border-border/50 pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Blood Type</span>
              <span className="font-semibold text-neon-red flex items-center gap-1"><Droplets size={10} />{profile.bloodType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Doctor</span>
              <span className="font-semibold text-foreground">{profile.doctor}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Scans</span>
              <span className="font-semibold text-primary flex items-center gap-1"><Scan size={10} />{profile.totalScans}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditing(true)}
            className="mt-4 w-full py-2.5 rounded-xl glass border border-border hover:border-primary/40 text-sm font-semibold text-foreground flex items-center justify-center gap-2 transition-all"
          >
            <Edit3 size={14} /> Edit Profile
          </motion.button>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Editable fields */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground">Personal Information</h3>
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={save} className="px-3 py-1.5 rounded-lg bg-gradient-blue-purple text-white text-xs font-semibold flex items-center gap-1">
                    <Save size={12} /> Save
                  </button>
                  <button onClick={cancel} className="px-3 py-1.5 rounded-lg glass border border-border text-xs font-semibold text-foreground flex items-center gap-1">
                    <X size={12} /> Cancel
                  </button>
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", icon: User },
                { label: "Email", key: "email", icon: Mail },
                { label: "Age", key: "age", icon: Calendar },
                { label: "Gender", key: "gender", icon: User },
                { label: "Location", key: "location", icon: MapPin },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                    <Icon size={11} /> {label}
                  </label>
                  {editing ? (
                    <input
                      value={String(draft[key as keyof typeof draft])}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg glass border border-primary/30 bg-transparent text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground px-3 py-2 rounded-lg bg-muted/30">
                      {String(profile[key as keyof typeof profile])}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Health metrics mini charts */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Health Metrics Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Health Score Trend */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Health Score</span>
                  <Activity size={13} className="text-neon-green" />
                </div>
                <div className="text-2xl font-display font-bold text-neon-green">{profile.healthScore}</div>
                <ResponsiveContainer width="100%" height={48}>
                  <LineChart data={healthMetricsHistory}>
                    <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} dot={false} />
                    <Tooltip content={<MiniTooltip />} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-neon-green mt-1">↑ Trending up</p>
              </div>

              {/* Risk Level */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Risk Level</span>
                  <div className="w-2 h-2 rounded-full bg-neon-green" />
                </div>
                <div className="text-2xl font-display font-bold text-neon-green mb-1">{profile.riskLevel || "Low"}</div>
                <div className="space-y-1">
                  {[
                    { label: "TSH", val: latestMetrics.tsh, max: 10, color: "#3b82f6" },
                    { label: "T3", val: latestMetrics.t3, max: 3, color: "#a855f7" },
                    { label: "T4", val: latestMetrics.t4, max: 15, color: "#06b6d4" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-5">{m.label}</span>
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(m.val / m.max) * 100}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Scan */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Last Scan</span>
                  <Scan size={13} className="text-primary" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{profile.lastScan}</div>
                <p className="text-xs text-muted-foreground mt-1">Ultrasound · Complete</p>
                <div className="mt-2 px-2 py-1 rounded-lg bg-neon-green/10 border border-neon-green/20 text-xs text-neon-green text-center">
                  No anomalies detected
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
