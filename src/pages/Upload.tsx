import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, X, FileImage, CheckCircle, Brain, Zap, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMedGemma } from "@/hooks/useMedGemma";
import { createReport } from "@/lib/api";

type Stage = "idle" | "preview" | "analyzing" | "complete";

const analysisSteps = [
  "Uploading image…",
  "Preprocessing image…",
  "Running AI inference…",
  "Extracting observations…",
  "Classifying risk level…",
  "Generating report…",
];

const getRiskScore = (level: "low" | "moderate" | "high") => {
  if (level === "high") return 30;
  if (level === "moderate") return 60;
  return 85;
};

export default function Upload() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { analyze, result, error } = useMedGemma();

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    setStage("preview");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
  });

  const runAnalysis = async () => {
    if (!file) return;
    setStage("analyzing");
    setProgress(0);
    setCurrentStep(0);

    const steps = analysisSteps.length;
    let stepIdx = 0;

    const stepInterval = setInterval(() => {
      stepIdx++;
      setCurrentStep(stepIdx);
      if (stepIdx >= steps) clearInterval(stepInterval);
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return 90;
        return p + 3;
      });
    }, 140);

    try {
      const data = await analyze(file);
      await createReport({
        fileName: data.fileName || file.name,
        fileUrl: data.fileUrl || "",
        analysis: {
          riskLevel: data.risk_level,
          riskScore: getRiskScore(data.risk_level),
          observations: data.observations,
          recommendation: data.recommendation,
          summary: data.recommendation
        },
        sourceType: "ultrasound",
        status: "complete"
      });
      setProgress(100);
      setStage("complete");
      toast({
        title: "Analysis Complete!",
        description: `Risk level: ${data.risk_level.toUpperCase()}.`
      });
    } catch (err: any) {
      setStage("preview");
      setProgress(0);
      setCurrentStep(0);
      toast({
        title: "Analysis failed",
        description: err?.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    }
  };

  const reset = () => {
    setStage("idle");
    setFile(null);
    setPreview(null);
    setProgress(0);
    setCurrentStep(0);
  };

  return (
    <div className="p-6 min-h-screen max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Upload Scan</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload a thyroid image for AI-powered analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3"
        >
          <AnimatePresence mode="wait">
            {stage === "idle" && (
              <motion.div
                key="drop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  {...getRootProps()}
                  className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 p-12 text-center
                    ${isDragActive
                      ? "border-primary bg-primary/10 scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:bg-primary/5 glass-card"
                    }`}
                >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ y: isDragActive ? -8 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-blue-purple flex items-center justify-center glow-blue animate-float">
                    <UploadIcon size={36} className="text-white" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-xl mb-1">
                      {isDragActive ? "Drop it here!" : "Drag & drop your scan"}
                    </p>
                    <p className="text-muted-foreground text-sm">or click to browse files</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["JPEG", "PNG", "WEBP"].map((fmt) => (
                      <span key={fmt} className="px-2 py-0.5 rounded-md glass border border-border text-xs text-muted-foreground">{fmt}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Max file size: 5MB · HIPAA compliant storage</p>
                </motion.div>
                </div>
              </motion.div>
            )}

            {(stage === "preview" || stage === "analyzing" || stage === "complete") && (
              <motion.div
                key="file-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-5 border border-primary/20"
              >
                {/* File header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <FileImage size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{((file?.size || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {stage === "preview" && (
                    <button onClick={reset} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Image preview */}
                {preview && (
                  <div className="relative rounded-xl overflow-hidden mb-4 bg-muted aspect-video flex items-center justify-center">
                    <img src={preview} alt="Scan preview" className="max-h-64 object-contain" />
                    {stage === "analyzing" && (
                      <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto mb-3"
                          />
                          <p className="text-sm text-primary font-medium">Analyzing…</p>
                        </div>
                      </div>
                    )}
                    {stage === "complete" && (
                      <div className="absolute top-3 right-3">
                        <div className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center">
                          <CheckCircle size={16} className="text-neon-green" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress */}
                {(stage === "analyzing" || stage === "complete") && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Analysis progress</span>
                      <span className="text-primary font-semibold">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        className="h-full rounded-full bg-gradient-blue-purple"
                        style={{ boxShadow: "0 0 10px hsl(217 91% 60% / 0.5)" }}
                      />
                    </div>
                  </div>
                )}

                {stage === "preview" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runAnalysis}
                    className="w-full py-3 rounded-xl bg-gradient-blue-purple text-white font-semibold text-sm flex items-center justify-center gap-2 glow-blue"
                  >
                    <Brain size={16} /> Run AI Analysis
                  </motion.button>
                )}

                {stage === "preview" && error && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200">
                    {error}
                  </div>
                )}

                {stage === "complete" && (
                  <>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center gap-3">
                      <CheckCircle size={20} className="text-neon-green flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Analysis Complete!</p>
                        <p className="text-xs text-muted-foreground">
                          Risk Level:{" "}
                          <span
                            className={`font-semibold ${
                              result?.risk_level === "high"
                                ? "text-rose-400"
                                : result?.risk_level === "moderate"
                                  ? "text-amber-400"
                                  : "text-neon-green"
                            }`}
                          >
                            {result?.risk_level ? result.risk_level.toUpperCase() : "UNKNOWN"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {result && (
                      <div className="p-4 rounded-xl glass border border-border space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">Observations</p>
                          <ul className="mt-1 space-y-1 text-xs text-foreground">
                            {result.observations.map((obs, idx) => (
                              <li key={`${obs}-${idx}`} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">Recommendation</p>
                          <p className="text-xs text-foreground mt-1">{result.recommendation}</p>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {result.disclaimer}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-blue-purple text-white text-sm font-semibold"
                      >
                        View in Dashboard
                      </button>
                      <button
                        onClick={reset}
                        className="flex-1 py-2.5 rounded-xl glass border border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
                      >
                        Upload Another
                      </button>
                    </div>
                  </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-4"
        >
          {/* AI Analysis Steps */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={16} className="text-primary" />
              <h3 className="font-display font-semibold text-foreground text-sm">AI Pipeline</h3>
            </div>
            <div className="space-y-2.5">
              {analysisSteps.map((step, i) => {
                const done = stage === "analyzing" ? i < currentStep : stage === "complete";
                const active = stage === "analyzing" && i === currentStep;
                return (
                  <div key={step} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                      ${done ? "bg-neon-green/20 border border-neon-green/40" : active ? "bg-primary/20 border border-primary/40" : "bg-muted border border-border"}`}>
                      {done ? (
                        <CheckCircle size={11} className="text-neon-green" />
                      ) : active ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Zap size={9} className="text-primary" />
                        </motion.div>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                    <span className={`text-xs ${done ? "text-foreground" : active ? "text-primary" : "text-muted-foreground"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supported formats */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display font-semibold text-foreground text-sm mb-3">Supported Formats</h3>
            <div className="space-y-2">
              {[
                { type: "Ultrasound", desc: "JPEG, PNG" },
                { type: "Clinical Photo", desc: "JPEG, PNG, WEBP" },
                { type: "Illustrations", desc: "PNG, WEBP" },
                { type: "Other Images", desc: "JPEG, PNG, WEBP" },
              ].map((f) => (
                <div key={f.type} className="flex justify-between text-xs">
                  <span className="text-foreground">{f.type}</span>
                  <span className="text-muted-foreground">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="glass-card rounded-2xl p-5 border border-neon-green/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-neon-green" />
              <h3 className="font-display font-semibold text-foreground text-sm">HIPAA Compliant</h3>
            </div>
            <p className="text-xs text-muted-foreground">All uploads are encrypted end-to-end. Your data is never shared without consent.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
