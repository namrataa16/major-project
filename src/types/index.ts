export type VehicleType = 
  | 'Heavy Truck'
  | 'Container Truck'
  | 'Multi-Axle'
  | 'Tipper'
  | 'Light Commercial Vehicle';

export type VehicleStatus = 'Available' | 'On Trip' | 'Maintenance' | 'Inactive';

export type TripStatus = 'Planned' | 'Loading' | 'On Route' | 'Delivered' | 'Delayed' | 'Cancelled';

export type LoadStatus = 'Draft' | 'Ready' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

export type DocumentType = 'RC' | 'Insurance' | 'PUC' | 'Fitness' | 'Permit' | 'Tax';

export type DocumentStatus = 'Valid' | 'Expiring Soon' | 'Expired';

export type ExpenseCategory = 
  | 'Fuel'
  | 'Toll'
  | 'Driver Advance'
  | 'Maintenance'
  | 'Parking'
  | 'Loading/Unloading'
  | 'Miscellaneous';

export type ExpenseStatus = 'Approved' | 'Pending' | 'Reimbursed' | 'Rejected';

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type RoadQuality = 'High' | 'Medium' | 'Low';
export type TerrainDifficulty = 'Low' | 'Medium' | 'High';

export interface Organization {
  id: string;
  name: string;
  tagline: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  address: string;
  fleetSize: number;
  logoUrl?: string;
}

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone: string;
}

export interface VehicleDocument {
  id: string;
  organizationId: string;
  vehicleId: string;
  vehicleRegistration: string;
  type: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: DocumentStatus;
  documentUrl?: string;
}

export interface MaintenanceRecord {
  id: string;
  organizationId: string;
  vehicleId: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  odometer: number;
  vendor: string;
}

export interface Vehicle {
  id: string;
  organizationId: string;
  registration: string;
  model: string;
  type: VehicleType;
  capacityTonnes: number;
  currentDriverId?: string;
  currentDriverName?: string;
  status: VehicleStatus;
  currentLocation: string;
  mileageKmPerL: number;
  axles: number;
  fuelType: 'Diesel' | 'CNG' | 'Electric' | 'LNG';
  chassisNumber: string;
  engineNumber: string;
  yearOfMfg: number;
  odometerKm: number;
  
  // Financial metrics
  revenueMonth: number;
  fuelCostMonth: number;
  tollCostMonth: number;
  maintenanceCostMonth: number;
  profitMonth: number;
  utilizationRate: number; // percentage (0-100)
  
  documents: VehicleDocument[];
  maintenanceHistory?: MaintenanceRecord[];
}

export interface Driver {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  currentVehicleId?: string;
  currentVehicleReg?: string;
  status: 'Available' | 'On Duty' | 'On Leave';
  rating: number; // 1-5
  totalTrips: number;
  joinedDate: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  gstin: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalTrips: number;
  totalRevenue: number;
  outstandingAmount: number;
  status: 'Active' | 'Inactive';
  creditPeriodDays: number;
}

export interface Load {
  id: string;
  organizationId: string;
  loadNumber: string;
  customerId: string;
  customerName: string;
  cargo: string;
  weightTonnes: number;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDeadline: string;
  vehicleRequirement: string;
  status: LoadStatus;
  estimatedRevenue: number;
  specialInstructions?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
}

export interface TripExpense {
  id: string;
  organizationId: string;
  tripId?: string;
  tripNumber?: string;
  vehicleId: string;
  vehicleRegistration: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  loggedBy: string;
}

export interface Trip {
  id: string;
  organizationId: string;
  tripNumber: string;
  customerId: string;
  customerName: string;
  loadId?: string;
  cargo: string;
  weightTonnes: number;
  vehicleId: string;
  vehicleRegistration: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedHours: number;
  eta: string;
  startDate: string;
  completedDate?: string;
  status: TripStatus;
  revenue: number;
  estimatedCost: number;
  actualCost?: number;
  profit: number;
  selectedRouteId?: string;
  selectedRouteName?: string;
  notes?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  routeCode: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedDuration: string; // e.g. "3h 35m"
  durationHours: number;
  estimatedFuelCost: number;
  tollCost: number;
  roadQuality: RoadQuality;
  terrainDifficulty: TerrainDifficulty;
  gradientPercentage: number;
  ghatSectionKm: number;
  elevationGainMeters: number;
  suitabilityScore: number;
  isRecommended: boolean;
  recommendedTagline?: string;
  reasons: string[];
  warnings?: string[];
  routePathDescription: string;
  mapPolylineCoords?: [number, number][]; // SVG map relative coordinates
}

export interface RouteScoringWeights {
  fuelCost: number;       // 25%
  travelTime: number;     // 20%
  roadQuality: number;    // 15%
  terrainDifficulty: number; // 15%
  vehicleSuitability: number; // 15%
  tollCost: number;       // 10%
}

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  tripId?: string;
  tripNumber?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paidDate?: string;
}

export interface SystemAlert {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: 'document' | 'trip' | 'maintenance' | 'compliance';
  date: string;
  resolved: boolean;
  actionLink?: string;
  actionText?: string;
  targetId?: string;
}

export interface VehicleMatchResult {
  vehicle: Vehicle;
  matchScore: number;
  isAvailable: boolean;
  capacityFitScore: number;
  locationFitScore: number;
  vehicleTypeFitScore: number;
  notes: string[];
}
