export type RiskLevel = "Low" | "Moderate" | "High";

export type ReportAnalysis = {
  tsh?: number;
  t3?: number;
  t4?: number;
  antiTPO?: number;
  noduleDetected?: boolean;
  noduleSize?: string;
  riskLevel?: RiskLevel | string;
  riskScore?: number;
  observations?: string[];
  recommendation?: string;
  summary?: string;
};

export type Report = {
  _id: string;
  fileName: string;
  fileUrl: string;
  analyzedDate?: string;
  createdAt?: string;
  analysis?: ReportAnalysis;
  sourceType?: string;
  status?: string;
};

export type RecentScan = {
  id: string;
  date: string;
  type: string;
  riskLevel: RiskLevel | string;
  score: number;
  status: string;
  notes: string;
  tsh: number;
  t3: number;
  t4: number;
};

export type DashboardUser = {
  name: string;
  email: string;
  age?: number | null;
  gender?: string | null;
  bloodType?: string | null;
  lastScan: string;
  totalScans: number;
  healthScore: number;
  riskLevel: RiskLevel | string;
  doctor?: string;
  location?: string;
};

export type DashboardSummary = {
  user: DashboardUser;
  tshTrendData: Array<{ month: string; TSH: number; T3: number; T4: number }>;
  monthlyScanData: Array<{ month: string; scans: number }>;
  riskDistributionData: Array<{ name: string; value: number; color: string }>;
  recentScans: RecentScan[];
  aiInsights: Array<{ feature: string; importance: number; direction: string; value: string }>;
};

export type AdminSummary = {
  totalUsers: number;
  totalReports: number;
  monthlyScanData: Array<{ month: string; scans: number }>;
  riskDistributionData: Array<{ name: string; value: number; color: string }>;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type UserProfile = {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  role?: string;
  onboarded?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
