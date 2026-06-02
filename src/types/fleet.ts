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
  distanceData: { vehicle: string; distance: number; formattedDistance: string }[];

  // Event Data
  totalEventsCount: number;
  eventsList: { id: string; vehicle: string; type: string; time: string; details: string }[];

  // Table Data
  violationsList: { id: string; vehicle: string; overspeedCount: number; maxSpeed: number; prohibitedDuration: number; riskLevel: RiskLevel }[];
  topPerformers: { vehicle: string; score: number }[];
}
