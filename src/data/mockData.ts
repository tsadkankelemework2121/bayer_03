export type RiskLevel = "Low" | "Medium" | "High";

export interface FleetData {
  title: string;
  month: string;
  organization: string;

  // Core KPIs
  totalVehicles: number;
  overspeedingVehicles: number;
  prohibitedDrivingVehicles: number;
  compliantPercent: number;
  highRiskPercent: number;
  nonCompliantPercent: number;
  
  // New KPIs for compliance tracking
  nightDrivingVehicles: number;
  continuousDrivingVehicles: number;
  complianceViolatingVehicles: number;

  // Speed Monitoring
  maxSpeed: number;
  maxSpeedVehicle: string;
  speedLimit: number;
  topViolator: string;
  topViolatorEvents: number;

  // Prohibited Driving
  worstProhibitedVehicle: string;
  worstProhibitedDuration: number; // in minutes
  worstProhibitedDistance: number; // in km
  worstProhibitedDistanceVehicle: string;

  // Chart Data
  speedAnalysisData: { vehicle: string; overspeedCount: number; maxSpeed: number }[];
  complianceData: { name: string; value: number; color: string }[];
  prohibitedData: { vehicle: string; duration: number; distance: number }[];

  // Table Data
  violationsList: { id: string; vehicle: string; overspeedCount: number; maxSpeed: number; prohibitedDuration: number; riskLevel: RiskLevel }[];
  topPerformers: { vehicle: string; score: number }[];
}

export const mockData: FleetData = {
  title: "Fleet Safety & Compliance Report",
  month: "January 2026",
  organization: "Bayer East Africa",

  // Core KPIs
  totalVehicles: 81,
  overspeedingVehicles: 45,
  prohibitedDrivingVehicles: 68,
  compliantPercent: 16,
  highRiskPercent: 20,
  nonCompliantPercent: 64,
  
  // New KPIs
  nightDrivingVehicles: 12,
  continuousDrivingVehicles: 8,
  complianceViolatingVehicles: 52,

  // Speed Monitoring
  maxSpeed: 0,
  maxSpeedVehicle: "N/A",
  speedLimit: 80,
  topViolator: "KCU 905Z",
  topViolatorEvents: 81,

  // Prohibited Driving
  worstProhibitedVehicle: "KDK 194K",
  worstProhibitedDuration: 518,
  worstProhibitedDistance: 541,
  worstProhibitedDistanceVehicle: "KDK 194K",

  // Chart Data
  speedAnalysisData: [
    { vehicle: "KCU 905Z", overspeedCount: 81, maxSpeed: 118 },
    { vehicle: "KCU 880Z", overspeedCount: 42, maxSpeed: 123 },
    { vehicle: "KDA 123X", overspeedCount: 35, maxSpeed: 115 },
    { vehicle: "KDB 456Y", overspeedCount: 28, maxSpeed: 112 },
    { vehicle: "KCY 789A", overspeedCount: 15, maxSpeed: 114 },
  ],
  complianceData: [
    { name: "Compliant", value: 16, color: "#8ad424" },
    { name: "Non-Compliant", value: 64, color: "#000000" },
    { name: "High Risk", value: 20, color: "#00bdff" },
  ],
  prohibitedData: [
    { vehicle: "KDK 194K", duration: 518, distance: 541 },
    { vehicle: "KCQ 234L", duration: 420, distance: 385 },
    { vehicle: "KDH 567M", duration: 310, distance: 290 },
    { vehicle: "KCA 890N", duration: 245, distance: 210 },
    { vehicle: "KDD 112P", duration: 180, distance: 155 },
  ],

  // Table Data
  violationsList: [
    { id: "1", vehicle: "KCU 905Z", overspeedCount: 81, maxSpeed: 118, prohibitedDuration: 120, riskLevel: "High" },
    { id: "2", vehicle: "KDK 194K", overspeedCount: 12, maxSpeed: 112, prohibitedDuration: 518, riskLevel: "High" },
    { id: "3", vehicle: "KCU 880Z", overspeedCount: 42, maxSpeed: 123, prohibitedDuration: 0, riskLevel: "Medium" },
    { id: "4", vehicle: "KCQ 234L", overspeedCount: 5, maxSpeed: 111, prohibitedDuration: 420, riskLevel: "Medium" },
    { id: "5", vehicle: "KDA 123X", overspeedCount: 35, maxSpeed: 115, prohibitedDuration: 45, riskLevel: "Medium" },
  ],
  topPerformers: [
    { vehicle: "KCA 101A", score: 99 },
    { vehicle: "KCB 202B", score: 98 },
    { vehicle: "KCC 303C", score: 97 },
    { vehicle: "KCD 404D", score: 96 },
    { vehicle: "KCE 505E", score: 95 },
    { vehicle: "KCF 606F", score: 94 },
    { vehicle: "KCG 707G", score: 93 },
    { vehicle: "KCH 808H", score: 92 },
    { vehicle: "KCI 909I", score: 91 },
    { vehicle: "KCJ 010J", score: 90 },
  ],
};
