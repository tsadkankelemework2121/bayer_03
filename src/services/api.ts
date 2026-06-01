import axios from 'axios';

export interface Drive {
  dt_start: string;          // trip start datetime
  dt_end: string;            // trip end datetime
  duration: string;          // human readable duration
  duration_seconds: number;  // trip duration in seconds
  route_length: number;      // trip distance in kilometers
  top_speed: number;         // maximum speed reached during this trip (km/h)
  avg_speed: number;         // average speed during this trip (km/h)
}

export interface Stop {
  stop_start: number;
  stop_end: number;
  lat: string;
  lng: string;
  altitude: string;
  angle: string;
  dt_start: string;          // stop start datetime
  dt_end: string;            // stop end datetime
  duration: string;
  duration_seconds: number;
}

export interface RoutePoint {
  dt_tracker: string;        // GPS timestamp
  lat: string;               // latitude
  lng: string;               // longitude
  altitude: string;
  angle: string;             // heading/direction
  speed: number;             // vehicle speed at this GPS point (km/h)
}

export interface Vehicle {
  imei: string;
  name: string;
  group: string | null;
  odometer: string;
  engine: string;
  status: string;
  dt_server: string;
  dt_tracker: string;
  lat: string;
  lng: string;
  altitude: string;
  angle: string;
  speed: string;
  fuel_1: string;
  fuel_2: string;
  fuel_can_level_percent: string | null;
  fuel_can_level_value: string | null;
  custom_fields: string | null;

  // New fields for the updated data structure
  plate?: string;
  total_distance?: string | number;
  drives?: Drive[];
  stops?: Stop[];
  events?: any[];
  routes?: RoutePoint[];
}

const API_URL = 'https://mellatech.et/et/api/api.php?api=user&ver=1.0&key=148259A8D255BD7CA1FA5D2C5E34E819&cmd=GET_USER_OBJECTS_ROUTE';
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<any>(API_URL);
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object') {
      return Object.entries(data).map(([imei, val]: [string, any]) => {
        return {
          imei,
          name: val.plate || `Vehicle ${imei}`,
          group: null,
          odometer: val.total_distance !== undefined ? String(val.total_distance) : '0',
          engine: 'off',
          status: 'Stopped',
          dt_server: '',
          dt_tracker: '',
          lat: '0',
          lng: '0',
          altitude: '0',
          angle: '0',
          speed: '0',
          fuel_1: '0',
          fuel_2: '0',
          fuel_can_level_percent: null,
          fuel_can_level_value: null,
          custom_fields: null,
          
          // Keep new properties
          plate: val.plate,
          total_distance: val.total_distance,
          drives: val.drives || [],
          stops: val.stops || [],
          events: val.events || [],
          routes: val.routes || [],
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    throw error;
  }
};
