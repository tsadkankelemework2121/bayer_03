import axios from 'axios';

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
}

const API_URL = 'https://mellatech.et/et/api/api.php?api=user&ver=1.0&key=922CE58215BAF1CC09C4BBCD14CE2D5E&cmd=USER_GET_OBJECTS';
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<Vehicle[]>(API_URL);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    throw error;
  }
};
