import { useState } from "react";
import { API_BASE } from "@/lib/api";

type RiskLevel = "low" | "moderate" | "high";

export type MedGemmaResult = {
  observations: string[];
  risk_level: RiskLevel;
  recommendation: string;
  disclaimer: string;
  fileUrl?: string;
  fileName?: string;
  storedFileName?: string;
};

export function useMedGemma() {
  const [result, setResult] = useState<MedGemmaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload?.error || "Server error";
        throw new Error(message);
      }

      const data = (await response.json()) as MedGemmaResult;
      setResult(data);
      return data;
    } catch (err: any) {
      const message = err?.message || "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyze, result, loading, error };
}
