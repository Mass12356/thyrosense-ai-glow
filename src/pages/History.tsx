import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, ChevronUp, Download, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { getReportHistory } from "@/lib/api";
import type { Report } from "@/lib/types";

type RiskFilter = "All" | "Low" | "Moderate" | "High";

function RiskBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; bg: string }> = {
    Low: { color: "text-neon-green", bg: "bg-neon-green/10 border-neon-green/30" },
    Moderate: { color: "text-neon-yellow", bg: "bg-neon-yellow/10 border-neon-yellow/30" },
    High: { color: "text-neon-red", bg: "bg-neon-red/10 border-neon-red/30" },
  };
  const c = config[level] || config.Low;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${c.color} ${c.bg}`}>
      {level === "Low" ? <CheckCircle size={10} /> : <AlertTriangle size={10} />} {level}
    </span>
  );
}

export default function History() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data } = useQuery({
    queryKey: ["report-history"],
    queryFn: getReportHistory
  });

  const scanHistory = useMemo(() => {
    const reports = (data || []) as Report[];
    return reports.map((report) => {
      const analysis = report.analysis || {};
      const riskLevel = String(analysis.riskLevel || "Low");
      const score = typeof analysis.riskScore === "number"
        ? analysis.riskScore
        : riskLevel.toLowerCase() === "high"
          ? 30
          : riskLevel.toLowerCase() === "moderate"
            ? 60
            : 85;

      const dateStr = report.analyzedDate || report.createdAt || new Date().toISOString();
      return {
        id: report._id,
        date: dateStr.slice(0, 10),
        type: report.sourceType || "Ultrasound",
        riskLevel: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
        score,
        status: report.status || "Complete",
        notes: analysis.summary || analysis.recommendation || "Scan completed.",
        tsh: analysis.tsh || 0,
        t3: analysis.t3 || 0,
        t4: analysis.t4 || 0
      };
    });
  }, [data]);

  const filtered = scanHistory
    .filter((s) => {
      const matchSearch =
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase()) ||
        s.date.includes(search);
      const matchRisk = riskFilter === "All" || s.riskLevel === riskFilter;
      return matchSearch && matchRisk;
    })
    .sort((a, b) => {
      const factor = sortDir === "desc" ? -1 : 1;
      if (sortBy === "date") return factor * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return factor * (a.score - b.score);
    });

  const toggleSort = (col: "date" | "score") => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="p-6 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Scan History</h1>
        <p className="text-muted-foreground text-sm mt-1">{scanHistory.length} total scans on record</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, type, or date…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass border border-border bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground flex-shrink-0" />
          {(["All", "Low", "Moderate", "High"] as RiskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${riskFilter === f
                  ? "bg-gradient-blue-purple text-white"
                  : "glass border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-border/50 text-xs text-muted-foreground font-medium">
          <span>Scan ID / Type</span>
          <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground transition-colors text-left">
            Date {sortBy === "date" ? (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : null}
          </button>
          <span>Risk</span>
          <button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-foreground transition-colors text-left">
            Score {sortBy === "score" ? (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : null}
          </button>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        <div>
          {filtered.map((scan, i) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_80px] gap-4 px-5 py-3.5 border-b border-border/30 hover:bg-primary/5 transition-colors cursor-pointer group"
                style={{
                  boxShadow: expandedId === scan.id ? "inset 0 0 0 1px hsl(217 91% 60% / 0.2)" : undefined,
                  background: expandedId === scan.id ? "hsl(217 91% 60% / 0.05)" : undefined,
                }}
                onClick={() => setExpandedId(expandedId === scan.id ? null : scan.id)}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{scan.type}</p>
                  <p className="text-xs text-muted-foreground font-mono">{scan.id}</p>
                </div>
                <div className="text-sm text-foreground flex items-center">{scan.date}</div>
                <div className="flex items-center">
                  <RiskBadge level={scan.riskLevel} />
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${scan.score}%`,
                          background: scan.score >= 75 ? "#22c55e" : scan.score >= 50 ? "#facc15" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{scan.score}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">
                    {scan.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg hover:bg-primary/15 transition-colors text-muted-foreground hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    <Eye size={13} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-primary/15 transition-colors text-muted-foreground hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    <Download size={13} />
                  </button>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {expandedId === scan.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expandedId === scan.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-primary/5 border-b border-border/30">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">AI Notes</p>
                          <p className="text-sm text-foreground">{scan.notes}</p>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">TSH</p>
                            <p className="text-sm font-bold text-neon-blue">{scan.tsh} mIU/L</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">T3</p>
                            <p className="text-sm font-bold text-neon-purple">{scan.t3} pg/mL</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">T4</p>
                            <p className="text-sm font-bold text-neon-cyan">{scan.t4} ng/dL</p>
                          </div>
                        </div>
                        <div className="flex justify-end items-start">
                          <button className="px-4 py-2 rounded-lg bg-gradient-blue-purple text-white text-xs font-semibold flex items-center gap-1.5">
                            <Download size={12} /> Download Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No scans match your filters.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
