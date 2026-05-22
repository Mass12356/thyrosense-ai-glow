import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err?.message || "Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-blue-purple flex items-center justify-center glow-blue">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-xs text-muted-foreground">Sign in to your ThyroSense account</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Mail size={11} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass border border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                <Lock size={11} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass border border-border bg-transparent text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-blue-purple text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"} <ArrowRight size={14} />
            </motion.button>
          </form>

          <div className="mt-5 text-xs text-muted-foreground flex items-center justify-between">
            <span>New here?</span>
            <Link to="/signup" className="text-primary hover:text-neon-cyan">Create an account</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}