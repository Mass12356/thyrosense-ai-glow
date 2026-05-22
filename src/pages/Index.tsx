import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Shield,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle,
  BarChart2,
  Scan,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models analyze your thyroid scans with 97% accuracy.",
    color: "text-neon-blue",
    glow: "shadow-[0_0_20px_hsl(217_91%_60%/0.3)]",
  },
  {
    icon: TrendingUp,
    title: "Real-time Monitoring",
    description: "Track TSH, T3, and T4 hormone levels over time with interactive trend charts.",
    color: "text-neon-purple",
    glow: "shadow-[0_0_20px_hsl(270_80%_65%/0.3)]",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Get instant risk classification with explainable AI insights.",
    color: "text-neon-cyan",
    glow: "shadow-[0_0_20px_hsl(185_100%_50%/0.3)]",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Personalized health notifications when your biomarkers need attention.",
    color: "text-neon-green",
    glow: "shadow-[0_0_20px_hsl(142_76%_50%/0.3)]",
  },
  {
    icon: BarChart2,
    title: "Detailed Reports",
    description: "Comprehensive scan reports with visual summaries for your doctor.",
    color: "text-neon-yellow",
    glow: "shadow-[0_0_20px_hsl(48_100%_60%/0.3)]",
  },
  {
    icon: Scan,
    title: "Multi-modal Scans",
    description: "Support for ultrasound, MRI, blood panels, and biopsy result uploads.",
    color: "text-neon-purple",
    glow: "shadow-[0_0_20px_hsl(270_80%_65%/0.3)]",
  },
];

const stats = [
  { value: "97%", label: "Accuracy Rate" },
  { value: "1.9M+", label: "Scans Analyzed" },
  { value: "50ms", label: "Analysis Speed" },
  { value: "24/7", label: "Monitoring" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-blue-purple flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg text-foreground">ThyroSense</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 rounded-lg bg-gradient-blue-purple text-white text-sm font-semibold flex items-center gap-2 glow-blue"
              >
                Get Started <ArrowRight size={14} />
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(217 91% 60%), transparent)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(270 80% 65%), transparent)" }} />
          <div className="absolute top-1/2 right-1/3 w-60 h-60 rounded-full opacity-8 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(185 100% 50%), transparent)" }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-sm text-primary mb-8"
          >
            <Zap size={12} className="text-neon-cyan" />
            <span>AI-Powered Medical Analysis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Smart Thyroid</span>
            <br />
            <span className="gradient-text">Monitoring with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            ThyroSense uses deep learning to analyze thyroid scans, track hormone trends, and provide
            real-time risk assessments — empowering you to take control of your health.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl bg-gradient-blue-purple text-white font-semibold text-base flex items-center gap-2 glow-blue"
              >
                Get Started Free <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl glass border border-border hover:border-primary/40 text-foreground font-semibold text-base flex items-center gap-2 transition-all"
              >
                <Scan size={16} /> Upload Scan
              </motion.button>
            </Link>
          </motion.div>

          {/* Checks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-muted-foreground"
          >
            {["No credit card required", "HIPAA Compliant", "256-bit encryption", "FDA registered"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-neon-green" /> {t}
              </span>
            ))}
          </motion.div>

          {/* Floating AI visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative mt-20 mx-auto max-w-3xl"
          >
            <div className="glass-card rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-red" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">thyrosense_ai_v3.2.1</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-3xl font-display font-bold text-neon-green mb-1">87</div>
                  <div className="text-xs text-muted-foreground">Health Score</div>
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "87%" }}
                      transition={{ delay: 0.8, duration: 1.5 }}
                      className="h-full rounded-full bg-neon-green"
                    />
                  </div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-3xl font-display font-bold text-neon-blue mb-1">2.2</div>
                  <div className="text-xs text-muted-foreground">TSH Level</div>
                  <div className="text-xs text-neon-green mt-1">Normal</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center mx-auto mb-1">
                    <Shield size={16} className="text-neon-green" />
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                  <div className="text-xs font-semibold text-neon-green mt-1">LOW</div>
                </div>
              </div>
              {/* AI scanning animation */}
              <div className="mt-4 glass rounded-xl p-3 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground">AI Analysis Running…</span>
                  <div className="ml-auto flex gap-1">
                    {[1,2,3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: ["6px", "18px", "6px"] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 bg-primary rounded-full"
                        style={{ minHeight: "6px" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {["TSH normalization detected", "T3/T4 ratio within optimal range", "No anomalous nodules found"].map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.3 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <CheckCircle size={11} className="text-neon-green flex-shrink-0" />
                      <span className="text-muted-foreground">{t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item} className="glass-card rounded-2xl p-6 text-center">
                <div className="text-4xl font-display font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Everything you need for <span className="gradient-text">thyroid health</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From upload to insights in seconds. ThyroSense combines clinical-grade AI with an intuitive dashboard.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mb-4 ${feature.glow} group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`${feature.color}`} size={22} />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              How <span className="gradient-text">ThyroSense</span> works
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Your Scan", desc: "Drag and drop your thyroid scan — ultrasound, MRI, or blood panel results.", icon: Scan },
              { step: "02", title: "AI Analysis", desc: "Our deep learning models analyze biomarkers and detect patterns in seconds.", icon: Brain },
              { step: "03", title: "Get Insights", desc: "Receive a detailed risk assessment with explainable AI recommendations.", icon: TrendingUp },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 relative"
              >
                <div className="text-5xl font-display font-black text-primary/10 mb-4">{s.step}</div>
                <div className="w-10 h-10 rounded-lg bg-gradient-blue-purple flex items-center justify-center mb-4">
                  <s.icon size={18} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 border border-primary/20"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 60% / 0.08), hsl(270 80% 65% / 0.08))" }}
          >
            <Activity size={48} className="text-primary mx-auto mb-6 animate-pulse-glow" />
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Start monitoring your thyroid <span className="gradient-text">today</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of patients and clinicians using ThyroSense for smarter thyroid care.
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-gradient-blue-purple text-white font-semibold text-lg glow-blue inline-flex items-center gap-2"
              >
                Open Dashboard <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            <span className="font-display font-bold text-foreground">ThyroSense</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 ThyroSense. AI-powered thyroid health monitoring.</p>
        </div>
      </footer>
    </div>
  );
}
