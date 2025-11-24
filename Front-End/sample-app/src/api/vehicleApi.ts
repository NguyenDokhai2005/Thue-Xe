// src/api/vehicleApi.ts
import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  const base = __DEV__
    ? (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080')
    : 'https://your-api.com';
  console.log('API BASE URL:', base); // LOG 1: Xem URL đang dùng
  return base;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

// LOG 2: In ra mọi request
api.interceptors.request.use((config) => {
  console.log('GỌI API:', config.method?.toUpperCase(), config.url);
  return config;
});

// LOG 3: In ra lỗi chi tiết
api.interceptors.response.use(
  (response) => {
    console.log('NHẬN DỮ LIỆU:', response.data);
    return response;
  },
  (error) => {
    console.log('LỖI API:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export interface VehiclePhoto {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface Vehicle {
  id: number;
  title: string;
  vehicleType: string;
  licensePlate: string;
  dailyPrice: number;
  currency: string;
  description?: string;
  status?: string;
  photos?: VehiclePhoto[];
  primaryPhotoUrl?: string; // URL của ảnh chính
}

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await api.get<Vehicle[]>('/api/vehicles');
    return response.data || [];
  } catch (error: any) {
    console.log('LỖI KẾT NỐI:', error.message); // LOG 4: Lỗi cuối cùng
    throw new Error('Không thể kết nối đến server');
  }
};