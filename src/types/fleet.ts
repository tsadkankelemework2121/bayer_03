export interface FleetData {
  title: string;
  month: string;
  organization: string;

  // Core KPIs
  totalVehicles: number;
  overspeedingVehicles: number;
  prohibitedDrivingVehicles: number;
  compliantPercent: number;
  nonCompliantPercent: number;
  
  // New KPIs for compliance tracking
  nightDrivingVehicles: number;
  continuousDrivingVehicles: number;
  complianceViolatingVehicles: number;
  complianceEligibleCount: number;
  compliantVehicleCount: number;
  nonCompliantVehicleCount: number;

  // Speed Monitoring
  maxSpeed: number;
  maxSpeedVehicle: string;
  maxSpeedDriver: string;
  speedLimit: number;
  topViolator: string;
  topViolatorDriver: string;
  topViolatorEvents: number;

  // Prohibited Driving
  worstProhibitedVehicle: string;
  worstProhibitedDuration: number; // in minutes
  worstProhibitedDistance: number; // in km
  worstProhibitedDistanceVehicle: string;

  // Chart Data
  speedAnalysisData: { vehicle: string; driver: string; overspeedCount: number; maxSpeed: number }[];
  complianceData: { name: string; value: number; color: string; vehicleCount: number }[];
  prohibitedData: { vehicle: string; duration: number; distance: number }[];

  // Event Data
  totalEventsCount: number;
  eventsList: { id: string; vehicle: string; driver: string; type: string; time: string; details: string }[];

  // Continuous Driving Data (drives with duration > 120 min and distance > 50 km)
  continuousDrivingList: {
    vehicle: string;
    driver: string;
    driveCount: number;
    totalDurationMinutes: number;
    totalRouteLength: number;
    drives: {
      duration: string;
      durationMinutes: number;
      routeLength: number;
    }[];
  }[];

  // Night Driving Data (drives overlapping 22:00–04:00)
  nightDrivingList: {
    vehicle: string;
    driver: string;
    nightDriveCount: number;
    totalNightMinutes: number;
    drives: { dtStart: string; dtEnd: string; overlapMinutes: number }[];
  }[];

  // Fleet Summary (all vehicles)
  fleetSummaryList: {
    id: string;
    vehicle: string;
    driver: string;
    overspeedCount: number;
    maxSpeed: number;
    totalDistance: number;
  }[];
}
