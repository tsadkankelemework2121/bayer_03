import type { Vehicle } from './api';
import type { FleetData } from '../types/fleet';

// Ethiopia geofence boundaries
const ETHIOPIA_BOUNDS = {
  minLat: 3.0,      // 3° 00′ N
  maxLat: 15.0,     // 15° 00′ N
  minLng: 33.0,     // 33° 00′ E
  maxLng: 48.0,     // 48° 00′ E
};

// Helper functions for new metrics
function parseDateLocal(dateStr: string): Date | null {
  try {
    if (!dateStr) return null;
    const normalized = dateStr.replace(/\//g, '-').replace('T', ' ');
    const parts = normalized.split(' ');
    if (parts.length < 2) return new Date(dateStr);
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');
    
    let year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // 0-based
    const day = parseInt(dateParts[2], 10);
    
    if (year < 100) year += 2000;
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    
    return new Date(year, month, day, hours, minutes, seconds);
  } catch {
    return null;
  }
}

// function isTimeInNightHours(dateString: string): boolean {
//   const date = parseDateLocal(dateString);
//   if (!date || isNaN(date.getTime())) return false;
//   const hours = date.getHours();
//   // Night hours are 22:00 (10 PM) to 05:00 (5 AM)
//   return hours >= 22 || hours < 5;
// }

function isDriveDuringNight(dtStartStr: string, dtEndStr: string): boolean {
  const start = parseDateLocal(dtStartStr);
  const end = parseDateLocal(dtEndStr);
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return false;
  
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  let tempDay = new Date(startDay);
  tempDay.setDate(tempDay.getDate() - 1);
  
  const endLimit = new Date(endDay);
  endLimit.setDate(endLimit.getDate() + 1);
  
  const tStart = start.getTime();
  const tEnd = end.getTime();
  
  while (tempDay <= endLimit) {
    const y = tempDay.getFullYear();
    const m = tempDay.getMonth();
    const d = tempDay.getDate();
    
    const nightStart = new Date(y, m, d, 22, 0, 0).getTime();
    const nextDay = new Date(y, m, d + 1);
    const nightEnd = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 5, 0, 0).getTime();
    
    const overlapStart = Math.max(tStart, nightStart);
    const overlapEnd = Math.min(tEnd, nightEnd);
    
    if (overlapStart < overlapEnd) {
      return true;
    }
    tempDay.setDate(tempDay.getDate() + 1);
  }
  
  return false;
}

function hasNightDrive(v: Vehicle): boolean {
  // Only use drives block for night driving detection
  if (!v.drives || v.drives.length === 0) return false;
  return v.drives.some(d => isDriveDuringNight(d.dt_start, d.dt_end));
}

function getVehicleMaxSpeed(v: Vehicle): number {
  // Check routes for max speed
  const routeMax = v.routes && v.routes.length > 0
    ? Math.max(...v.routes.map(r => r.speed || 0))
    : 0;
  // Check drives for max top_speed
  const driveMax = v.drives && v.drives.length > 0
    ? Math.max(...v.drives.map(d => d.top_speed || 0))
    : 0;
  // Return whichever is higher
  return Math.max(routeMax, driveMax);
}

function parseDurationToMinutes(durationStr: string): number {
  // Parse duration like "10 h 10 min 20 s", "2 h 30 min", "45 min 10 s", etc.
  if (!durationStr) return 0;
  let totalMinutes = 0;
  const hMatch = durationStr.match(/(\d+)\s*h/);
  const mMatch = durationStr.match(/(\d+)\s*min/);
  const sMatch = durationStr.match(/(\d+)\s*s/);
  if (hMatch) totalMinutes += parseInt(hMatch[1], 10) * 60;
  if (mMatch) totalMinutes += parseInt(mMatch[1], 10);
  if (sMatch) totalMinutes += parseInt(sMatch[1], 10) / 60;
  return totalMinutes;
}

function calculateNightOverlapMinutes(dtStartStr: string, dtEndStr: string): number {
  const start = parseDateLocal(dtStartStr);
  const end = parseDateLocal(dtEndStr);
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  let tempDay = new Date(startDay);
  tempDay.setDate(tempDay.getDate() - 1);

  const endLimit = new Date(endDay);
  endLimit.setDate(endLimit.getDate() + 1);

  const tStart = start.getTime();
  const tEnd = end.getTime();
  let totalOverlapMs = 0;

  while (tempDay <= endLimit) {
    const y = tempDay.getFullYear();
    const m = tempDay.getMonth();
    const d = tempDay.getDate();

    const nightStart = new Date(y, m, d, 22, 0, 0).getTime();
    const nextDay = new Date(y, m, d + 1);
    const nightEnd = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 5, 0, 0).getTime();

    const overlapStart = Math.max(tStart, nightStart);
    const overlapEnd = Math.min(tEnd, nightEnd);

    if (overlapStart < overlapEnd) {
      totalOverlapMs += overlapEnd - overlapStart;
    }
    tempDay.setDate(tempDay.getDate() + 1);
  }

  return Math.round(totalOverlapMs / 60000); // convert ms to minutes
}

function isWithinEthiopiaBounds(lat: number, lng: number): boolean {
  return (
    lat >= ETHIOPIA_BOUNDS.minLat &&
    lat <= ETHIOPIA_BOUNDS.maxLat &&
    lng >= ETHIOPIA_BOUNDS.minLng &&
    lng <= ETHIOPIA_BOUNDS.maxLng
  );
}

function getVehicleSpeed(v: Vehicle): number {
  if (!v.routes || v.routes.length === 0) return 0;
  return Math.max(...v.routes.map(r => r.speed || 0));
}

function isProhibitedZone(vehicle: Vehicle): boolean {
  // If vehicle has routes, check if any route point is outside Ethiopia bounds
  if (vehicle.routes && vehicle.routes.length > 0) {
    return vehicle.routes.some(r => {
      const lat = parseFloat(r.lat || '0');
      const lng = parseFloat(r.lng || '0');
      if (lat !== 0 && lng !== 0) {
        return !isWithinEthiopiaBounds(lat, lng);
      }
      return false;
    });
  }

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
  const speedLimit = 110; // Speed limit threshold
  const isOverspeeding = (speed: number) => speed > speedLimit;
  const continuousDrivingThreshold = 120; // 2 hours in minutes
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate total vehicles
  const totalVehicles = vehicles.length;

  // Calculate overspeeding vehicles (speed > 110)
  const overspeedingVehicles = vehicles.filter(v => {
    const speed = getVehicleSpeed(v);
    return isOverspeeding(speed);
  }).length;

  // Calculate night driving vehicles (driving during night hours: 22:00 to 05:00)
  const nightDrivingVehicles = vehicles.filter(v => hasNightDrive(v)).length;

  // Calculate continuous driving vehicles (any drive with duration > 120 min from drives block)
  const continuousDrivingVehicles = vehicles.filter(v => {
    if (!v.drives || v.drives.length === 0) return false;
    return v.drives.some(d => parseDurationToMinutes(d.duration) > continuousDrivingThreshold);
  }).length;

  // Calculate geofence/prohibited zone violations
  const prohibitedDrivingVehicles = vehicles.filter(v => {
    const speed = getVehicleSpeed(v);
    const isMoving = speed > 5;
    const inProhibited = isProhibitedZone(v);
    return isMoving && inProhibited;
  }).length;

  // Calculate compliance percentages strictly based on Speed Compliance (speed > 110 km/h)
  const nonCompliantPercent = totalVehicles > 0 ? Math.round((overspeedingVehicles / totalVehicles) * 100) : 0;
  const compliantPercent = totalVehicles > 0 ? 100 - nonCompliantPercent : 0;

  // Build continuous driving list from drives block (duration > 120 min)
  const continuousDrivingList: FleetData['continuousDrivingList'] = [];
  vehicles.forEach(v => {
    if (!v.drives || v.drives.length === 0) return;
    v.drives.forEach(d => {
      const mins = parseDurationToMinutes(d.duration);
      if (mins > continuousDrivingThreshold) {
        continuousDrivingList.push({
          vehicle: v.name || v.plate || `Vehicle ${v.imei.slice(-4)}`,
          duration: d.duration,
          durationMinutes: Math.round(mins),
          routeLength: d.route_length || 0,
        });
      }
    });
  });
  continuousDrivingList.sort((a, b) => b.durationMinutes - a.durationMinutes);

  // Build night driving list from drives that overlap 22:00–05:00
  const nightDrivingMap = new Map<string, { vehicle: string; drives: { dtStart: string; dtEnd: string; overlapMinutes: number }[] }>();
  vehicles.forEach(v => {
    if (!v.drives || v.drives.length === 0) return;
    const vName = v.name || v.plate || `Vehicle ${v.imei.slice(-4)}`;
    v.drives.forEach(d => {
      if (isDriveDuringNight(d.dt_start, d.dt_end)) {
        const overlap = calculateNightOverlapMinutes(d.dt_start, d.dt_end);
        if (overlap > 0) {
          if (!nightDrivingMap.has(v.imei)) {
            nightDrivingMap.set(v.imei, { vehicle: vName, drives: [] });
          }
          nightDrivingMap.get(v.imei)!.drives.push({
            dtStart: d.dt_start,
            dtEnd: d.dt_end,
            overlapMinutes: overlap,
          });
        }
      }
    });
  });
  const nightDrivingList: FleetData['nightDrivingList'] = Array.from(nightDrivingMap.values()).map(entry => ({
    vehicle: entry.vehicle,
    nightDriveCount: entry.drives.length,
    totalNightMinutes: entry.drives.reduce((sum, d) => sum + d.overlapMinutes, 0),
    drives: entry.drives,
  })).sort((a, b) => b.totalNightMinutes - a.totalNightMinutes);

  // Calculate speed monitoring metrics
  const speedData = vehicles
    .map(v => {
      const speed = getVehicleSpeed(v);
      const isMoving = speed > 5;
      const isNightDrive = hasNightDrive(v);
      const hasContinuous = v.drives ? v.drives.some(d => parseDurationToMinutes(d.duration) > continuousDrivingThreshold) : false;
      
      const lastRoutePoint = v.routes && v.routes.length > 0 ? v.routes[v.routes.length - 1] : null;
      const latitude = lastRoutePoint ? parseFloat(lastRoutePoint.lat || '0') : parseFloat(v.lat || '0');
      const longitude = lastRoutePoint ? parseFloat(lastRoutePoint.lng || '0') : parseFloat(v.lng || '0');

      return {
        vehicle: v.name,
        imei: v.imei,
        speed,
        isMoving,
        nightDriving: isNightDrive,
        continuousDriving: hasContinuous,
        continuousMinutes: 0,
        latitude,
        longitude,
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
    if (isOverspeeding(v.speed)) violations += 10;
    if (v.nightDriving) violations += 5;
    if (v.continuousDriving) violations += 8;
    if (v.isInProhibited) violations += 15;
    
    if (violations > topViolatorEvents) {
      topViolatorEvents = violations;
      topViolator = v.vehicle;
    }
  });

  // Build speed analysis data for chart - only vehicles with overspeeding violations (> 110 km/h)
  const speedAnalysisData = speedData
    .map((sd) => {
      const v = vehicles.find((veh) => veh.imei === sd.imei);
      const routes = v?.routes || [];
      let overspeedCount = 0;
      if (routes.length > 0) {
        overspeedCount = routes.filter((r) => (r.speed || 0) > 110).length;
      } else {
        overspeedCount = sd.speed > 110 ? 1 : 0;
      }
      return {
        vehicle: sd.vehicle,
        overspeedCount,
        maxSpeed: Math.round(sd.speed),
      };
    })
    .filter((item) => item.overspeedCount > 0)
    .sort((a, b) => b.overspeedCount - a.overspeedCount)
    .slice(0, 10);

  // Calculate geofence violations (vehicles outside Ethiopia bounds)
  const prohibitedData = speedData
    .filter(v => v.isInProhibited) // Only vehicles in geofence violation
    .slice(0, 5)
    .map((v) => ({
      vehicle: v.vehicle, // Use plate number (vehicle name)
      duration: Math.round(parseDurationToMinutes(vehicles.find(vehicle => vehicle.imei === v.imei)?.status || '') || 0),
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
  ];

  // Build fleet summary list for ALL vehicles
  const fleetSummaryList = vehicles.map(v => {
    const vName = v.name || v.plate || `Vehicle ${v.imei.slice(-4)}`;
    
    // Overspeed count: number of route points > 110 km/h
    const routes = v.routes || [];
    const overspeedCount = routes.length > 0
      ? routes.filter(r => (r.speed || 0) > speedLimit).length
      : 0;
    
    // Max speed: check both routes and drives top_speed
    const maxSpeed = Math.round(getVehicleMaxSpeed(v));
    
    // Total distance: from total_distance field
    let totalDistance = 0;
    if (v.total_distance !== undefined && v.total_distance !== null) {
      totalDistance = typeof v.total_distance === 'number' ? v.total_distance : parseFloat(String(v.total_distance));
    }
    if (isNaN(totalDistance)) totalDistance = 0;
    
    return {
      id: v.imei,
      vehicle: vName,
      overspeedCount,
      maxSpeed,
      totalDistance,
    };
  }).sort((a, b) => b.maxSpeed - a.maxSpeed);

  // Extract all vehicle events safely
  const parsedEvents = vehicles.flatMap(v => {
    const rawEvents = v.events || [];
    return rawEvents.map((e, idx) => {
      const type = String(e.event || e.type || e.event_desc || 'Alert');
      const time = String(e.dt_tracker || e.dt_server || e.time || 'N/A');
      const details = String(e.details || (e.speed ? `Recorded Speed: ${e.speed} km/h` : 'System generated alert'));
      return {
        id: `${v.imei}-${idx}-${time}`,
        vehicle: v.name || v.plate || `Vehicle ${v.imei.slice(-4)}`,
        type,
        time,
        details,
      };
    });
  }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const totalEventsCount = parsedEvents.length;

  return {
    title: 'Fleet Safety & Compliance Report',
    month: monthName,
    organization: 'Bayer East Africa',

    // Core KPIs
    totalVehicles,
    overspeedingVehicles,
    prohibitedDrivingVehicles,
    compliantPercent,
    nonCompliantPercent,
    
    // New KPIs for requested metrics
    nightDrivingVehicles,
    continuousDrivingVehicles,
    complianceViolatingVehicles: overspeedingVehicles,

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

    // Event Data
    totalEventsCount,
    eventsList: parsedEvents,

    // Continuous Driving & Night Driving lists
    continuousDrivingList,
    nightDrivingList,

    // Fleet Summary (all vehicles)
    fleetSummaryList,
  };
}
