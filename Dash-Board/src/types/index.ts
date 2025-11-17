export enum VehicleType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  HATCHBACK = 'HATCHBACK',
  COUPE = 'COUPE',
  CONVERTIBLE = 'CONVERTIBLE',
  WAGON = 'WAGON',
  PICKUP = 'PICKUP',
  VAN = 'VAN',
  MOTORCYCLE = 'MOTORCYCLE'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Vehicle {
  id: number;
  title: string;
  vehicleType: VehicleType;
  licensePlate: string;
  dailyPrice: number;
  currency: string;
  status: VehicleStatus;
  description?: string;
}

export interface VehicleRequest {
  title: string;
  vehicleType: VehicleType;
  licensePlate: string;
  dailyPrice: number;
  currency: string;
  description?: string;
}

export interface Booking {
  id: number;
  vehicleId: number;
  vehicleTitle: string;
  vehicleType: VehicleType;
  renterId: number;
  status: BookingStatus;
  startAt: string;
  endAt: string;
  dailyPriceSnapshot: number;
  totalAmount: number;
  currency: string;
  notes?: string;
}

export interface BookingCreateRequest {
  vehicleId: number;
  startAt: string;
  endAt: string;
  notes?: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  phone?: string;
}

