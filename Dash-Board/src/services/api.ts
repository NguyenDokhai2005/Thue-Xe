import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type {
  Vehicle,
  VehicleRequest,
  Booking,
  BookingCreateRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  VehicleType
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (unauthorized)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', { oldPassword, newPassword });
  },
};

// Vehicle APIs
export const vehicleApi = {
  list: async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },
  getById: async (id: number): Promise<Vehicle> => {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },
  search: async (params?: {
    type?: VehicleType;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles/search', { params });
    return response.data;
  },
  create: async (data: VehicleRequest): Promise<Vehicle> => {
    const response = await api.post<Vehicle>('/vehicles', data);
    return response.data;
  },
  update: async (id: number, data: VehicleRequest): Promise<Vehicle> => {
    const response = await api.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};

// Booking APIs
export const bookingApi = {
  create: async (data: BookingCreateRequest): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/me');
    return response.data;
  },
  confirm: async (id: number): Promise<Booking> => {
    const response = await api.post<Booking>(`/bookings/${id}/confirm`);
    return response.data;
  },
  activate: async (id: number): Promise<Booking> => {
    const response = await api.post<Booking>(`/bookings/${id}/activate`);
    return response.data;
  },
  complete: async (id: number): Promise<Booking> => {
    const response = await api.post<Booking>(`/bookings/${id}/complete`);
    return response.data;
  },
  cancel: async (id: number): Promise<Booking> => {
    const response = await api.post<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },
};

export default api;

