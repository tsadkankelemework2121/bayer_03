import type { Vehicle } from './api';
import type { FleetData } from '../data/mockData';

// Ethiopia geofence boundaries
const ETHIOPIA_BOUNDS = {
  minLat: 3.0,      // 3° 00′ N
  maxLat: 15.0,     // 15° 00′ N
  minLng: 33.0,     // 33° 00′ E
  maxLng: 48.0,     // 48° 00′ E
};

// Helper functions for new metrics
function isNightHours(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const hours = date.getHours();
    // Night hours: 20:00 (8 PM) to 06:00 (6 AM)
    return hours >= 20 || hours < 6;
  } catch {
    return false;
  }
}

function calculateContinuousDrivingTime(status: string): number {
  // Parse status string like "Stopped 17 h 38 min 14 s" or "Driving 2 h 30 min"
  const match = status.match(/(\d+)\s*h\s*(\d+)\s*min/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    return hours * 60 + minutes; // Return total minutes
  }
  return 0;
}

function isWithinEthiopiaBounds(lat: number, lng: number): boolean {
  return (
    lat >= ETHIOPIA_BOUNDS.minLat &&
    lat <= ETHIOPIA_BOUNDS.maxLat &&
    lng >= ETHIOPIA_BOUNDS.minLng &&
    lng <= ETHIOPIA_BOUNDS.maxLng
  );
}

function isProhibitedZone(vehicle: Vehicle): boolean {
  // Check if vehicle is outside Ethiopia bounds (geofence violation)
  const lat = parseFloat(vehicle.lat || '0');
  const lng = parseFloat(vehicle.lng || '0');
  
  // If vehicle has valid coordinates and is outside Ethiopia, it's in prohibited zone
  if (lat !== 0 && lng !== 0) {
    return !isWithinEthiopiaBounds(lat, lng);
  }
  
  // Fallback: check status for prohibited indicators
  const prohibitedIndicators = ['prohibited', 'geofence', 'out of zone', 'unauthorized'];
  const statusLower = (vehicle.status || '').toLowerCase();
  const customFieldsStr = JSON.stringify(vehicle.custom_fields || {}).toLowerCase();
  
  return prohibitedIndicators.some(indicator => 
    statusLower.includes(indicator) || customFieldsStr.includes(indicator)
  );
}

export function processFleetData(vehicles: Vehicle[]): FleetData {
  const speedLimit = 80; // Speed limit threshold: >= 80 km/h is overspeeding
  const continuousDrivingThreshold = 360; // 6 hours in minutes
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate total vehicles
  const totalVehicles = vehicles.length;

  // Calculate overspeeding vehicles (speed >= speedLimit)
  const overspeedingVehicles = vehicles.filter(v => {
    const speed = parseFloat(v.speed || '0');
    return speed >= speedLimit;
  }).length;

  // Calculate night driving vehicles (driving during night hours)
  const nightDrivingVehicles = vehicles.filter(v => {
    const speed = parseFloat(v.speed || '0');
    const isMoving = speed > 5;
    const isDuringNight = isNightHours(v.dt_tracker || v.dt_server);
    return isMoving && isDuringNight;
  }).length;

  // Calculate continuous driving vehicles (driving for extended periods without breaks)
  const continuousDrivingVehicles = vehicles.filter(v => {
    const speed = parseFloat(v.speed || '0');
    const isMoving = speed > 5;
    const drivingTime = calculateContinuousDrivingTime(v.status || '');
    return isMoving && drivingTime > continuousDrivingThreshold;
  }).length;

  // Calculate geofence/prohibited zone violations
  const prohibitedDrivingVehicles = vehicles.filter(v => {
    const speed = parseFloat(v.speed || '0');
    const isMoving = speed > 5;
    const inProhibited = isProhibitedZone(v);
    return isMoving && inProhibited;
  }).length;

  // Calculate compliance percentages (vehicles with any violations)
  const violatingVehicles = new Set<string>();
  vehicles.forEach(v => {
    const speed = parseFloat(v.speed || '0');
    const isMoving = speed > 5;
    
    if (isMoving && speed >= speedLimit) violatingVehicles.add(v.imei);
    if (isMoving && isNightHours(v.dt_tracker || v.dt_server)) violatingVehicles.add(v.imei);
    if (isMoving && calculateContinuousDrivingTime(v.status || '') > continuousDrivingThreshold) violatingVehicles.add(v.imei);
    if (isMoving && isProhibitedZone(v)) violatingVehicles.add(v.imei);
  });

  const compliantVehicles = totalVehicles - violatingVehicles.size;
  const compliantPercent = totalVehicles > 0 ? Math.round((compliantVehicles / totalVehicles) * 100) : 0;
  const nonCompliantPercent = totalVehicles > 0 ? Math.round((violatingVehicles.size / totalVehicles) * 100) : 0;
  const highRiskPercent = totalVehicles > 0 ? Math.round(((prohibitedDrivingVehicles + continuousDrivingVehicles) / totalVehicles) * 100) : 0;

  // Calculate speed monitoring metrics
  const speedData = vehicles
    .map(v => {
      const speed = parseFloat(v.speed || '0');
      const isMoving = speed > 5;
      const isNightDrive = isMoving && isNightHours(v.dt_tracker || v.dt_server);
      const continuousTime = calculateContinuousDrivingTime(v.status || '');
      const isContinuous = isMoving && continuousTime > continuousDrivingThreshold;
      
      return {
        vehicle: v.name,
        imei: v.imei,
        speed,
        isMoving,
        nightDriving: isNightDrive,
        continuousDriving: isContinuous,
        continuousMinutes: continuousTime,
        latitude: parseFloat(v.lat || '0'),
        longitude: parseFloat(v.lng || '0'),
        isInProhibited: isMoving && isProhibitedZone(v),
      };
    })
    .sort((a, b) => b.speed - a.speed);

  const maxSpeedVehicle = speedData[0]?.vehicle || 'N/A';
  const maxSpeed = speedData[0]?.speed || 0;

  // Find top violator (vehicle with most violations across all categories)
  let topViolator = maxSpeedVehicle;
  let topViolatorEvents = 0;
  
  speedData.forEach(v => {
    let violations = 0;
    if (v.speed >= speedLimit) violations += 10;
    if (v.nightDriving) violations += 5;
    if (v.continuousDriving) violations += 8;
    if (v.isInProhibited) violations += 15;
    
    if (violations > topViolatorEvents) {
      topViolatorEvents = violations;
      topViolator = v.vehicle;
    }
  });

  // Build speed analysis data for chart - only vehicles with overspeeding violations
  const speedAnalysisData = speedData
    .filter(v => v.speed >= speedLimit) // Only show overspeeding vehicles (>= 80 km/h)
    .slice(0, 5)
    .map((v) => ({
      vehicle: v.vehicle, // Use plate number (vehicle name)
      overspeedCount: Math.max(1, Math.round((v.speed - speedLimit) / 5)), // Count based on how much over limit
      maxSpeed: Math.round(v.speed),
    }));

  // Calculate geofence violations (vehicles outside Ethiopia bounds)
  const prohibitedData = speedData
    .filter(v => v.isInProhibited) // Only vehicles in geofence violation
    .slice(0, 5)
    .map((v) => ({
      vehicle: v.vehicle, // Use plate number (vehicle name)
      duration: Math.round(calculateContinuousDrivingTime(vehicles.find(vehicle => vehicle.imei === v.imei)?.status || '') || 0),
      distance: parseFloat(vehicles.find(vehicle => vehicle.imei === v.imei)?.odometer || '0'), // Use odometer if available
    }));

  const worstProhibitedVehicle = prohibitedData[0]?.vehicle || 'N/A';
  const worstProhibitedDuration = prohibitedData[0]?.duration || 0;
  const worstProhibitedDistance = prohibitedData[0]?.distance || 0;
  const worstProhibitedDistanceVehicle = prohibitedData[0]?.vehicle || 'N/A';

  // Build compliance chart data
  const complianceData = [
    { name: 'Compliant', value: compliantPercent, color: '#8ad424' },
    { name: 'Non-Compliant', value: nonCompliantPercent, color: '#000000' },
    { name: 'High Risk', value: highRiskPercent, color: '#00bdff' },
  ];

  // Build violations list - only include vehicles with violations
  const violationsList = speedData
    .filter(v => {
      // Include if vehicle has any violation
      return v.speed >= speedLimit || v.nightDriving || v.continuousDriving || v.isInProhibited;
    })
    .map((v) => {
      const prohibitedDuration = prohibitedData.find(p => p.vehicle === v.vehicle)?.duration || 0;
      const riskLevel: 'Low' | 'Medium' | 'High' =
        v.speed > speedLimit + 20 || prohibitedDuration > 300
          ? 'High'
          : v.speed > speedLimit || prohibitedDuration > 100
            ? 'Medium'
            : 'Low';
      return {
        id: v.imei,
        vehicle: v.vehicle,
        overspeedCount: speedAnalysisData.find(s => s.vehicle === v.vehicle)?.overspeedCount || 0,
        maxSpeed: Math.round(v.speed),
        prohibitedDuration,
        riskLevel,
      };
    })
    .slice(0, 5);

  // Build top performers list (vehicles with lowest violations)
  const topPerformers = vehicles
    .map((v) => ({
      vehicle: v.name,
      speed: parseFloat(v.speed || '0'),
    }))
    .filter(v => v.speed <= speedLimit)
    .sort((a, b) => a.speed - b.speed)
    .slice(0, 10)
    .map((v, index) => ({
      vehicle: v.vehicle,
      score: Math.max(90, 100 - (index * 1) - Math.round(v.speed / 2)),
    }));

  return {
    title: 'Fleet Safety & Compliance Report',
    month: monthName,
    organization: 'Bayer East Africa',

    // Core KPIs
    totalVehicles,
    overspeedingVehicles,
    prohibitedDrivingVehicles,
    compliantPercent,
    highRiskPercent,
    nonCompliantPercent,
    
    // New KPIs for requested metrics
    nightDrivingVehicles,
    continuousDrivingVehicles,
    complianceViolatingVehicles: violatingVehicles.size,

    // Speed Monitoring
    maxSpeed: Math.round(maxSpeed),
    maxSpeedVehicle,
    speedLimit,
    topViolator,
    topViolatorEvents,

    // Prohibited Driving
    worstProhibitedVehicle,
    worstProhibitedDuration,
    worstProhibitedDistance,
    worstProhibitedDistanceVehicle,

    // Chart Data
    speedAnalysisData,
    complianceData,
    prohibitedData,

    // Table Data
    violationsList,
    topPerformers: topPerformers.length > 0 ? topPerformers : [
      { vehicle: 'No data', score: 0 }
    ],
  };
}
