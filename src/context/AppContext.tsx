import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  User,
  Vehicle,
  Driver,
  Customer,
  Load,
  Trip,
  TripExpense,
  VehicleDocument,
  Invoice,
  SystemAlert,
  RouteScoringWeights,
  VehicleStatus,
  TripStatus
} from '../types';
import {
  MOCK_ORGANIZATION,
  MOCK_USER,
  MOCK_VEHICLES,
  MOCK_DRIVERS,
  MOCK_CUSTOMERS,
  MOCK_LOADS,
  MOCK_TRIPS,
  MOCK_EXPENSES,
  MOCK_DOCUMENTS,
  MOCK_INVOICES,
  MOCK_ALERTS
} from '../data/mockData';
import { DEFAULT_ROUTE_WEIGHTS } from '../utils/routeScorer';

interface AppContextType {
  organization: Organization;
  currentUser: User | null;
  isAuthenticated: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
  customers: Customer[];
  loads: Load[];
  trips: Trip[];
  expenses: TripExpense[];
  documents: VehicleDocument[];
  invoices: Invoice[];
  alerts: SystemAlert[];
  routeWeights: RouteScoringWeights;
  
  // Actions
  login: (email?: string, password?: string) => void;
  logout: () => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'organizationId' | 'revenueMonth' | 'fuelCostMonth' | 'tollCostMonth' | 'maintenanceCostMonth' | 'profitMonth' | 'utilizationRate' | 'documents'>) => Vehicle;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  createTrip: (trip: Omit<Trip, 'id' | 'organizationId' | 'tripNumber'>) => Trip;
  updateTripStatus: (tripId: string, status: TripStatus) => void;
  addLoad: (load: Omit<Load, 'id' | 'organizationId' | 'loadNumber'>) => Load;
  assignVehicleToLoad: (loadId: string, vehicleId: string) => void;
  addExpense: (expense: Omit<TripExpense, 'id' | 'organizationId'>) => TripExpense;
  addDocument: (doc: Omit<VehicleDocument, 'id' | 'organizationId' | 'daysRemaining' | 'status'>) => VehicleDocument;
  addCustomer: (customer: Omit<Customer, 'id' | 'organizationId' | 'totalTrips' | 'totalRevenue' | 'outstandingAmount'>) => Customer;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'organizationId' | 'invoiceNumber'>) => Invoice;
  resolveAlert: (alertId: string) => void;
  updateRouteWeights: (weights: RouteScoringWeights) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'ongo_fleet_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load persisted state
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return null;
  };

  const savedState = loadInitialState();

  const [organization] = useState<Organization>(savedState?.organization || MOCK_ORGANIZATION);
  const [currentUser, setCurrentUser] = useState<User | null>(savedState?.currentUser || MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(savedState ? (savedState.isAuthenticated ?? true) : true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(savedState?.vehicles || MOCK_VEHICLES);
  const [drivers, setDrivers] = useState<Driver[]>(savedState?.drivers || MOCK_DRIVERS);
  const [customers, setCustomers] = useState<Customer[]>(savedState?.customers || MOCK_CUSTOMERS);
  const [loads, setLoads] = useState<Load[]>(savedState?.loads || MOCK_LOADS);
  const [trips, setTrips] = useState<Trip[]>(savedState?.trips || MOCK_TRIPS);
  const [expenses, setExpenses] = useState<TripExpense[]>(savedState?.expenses || MOCK_EXPENSES);
  const [documents, setDocuments] = useState<VehicleDocument[]>(savedState?.documents || MOCK_DOCUMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(savedState?.invoices || MOCK_INVOICES);
  const [alerts, setAlerts] = useState<SystemAlert[]>(savedState?.alerts || MOCK_ALERTS);
  const [routeWeights, setRouteWeights] = useState<RouteScoringWeights>(savedState?.routeWeights || DEFAULT_ROUTE_WEIGHTS);

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        organization,
        currentUser,
        isAuthenticated,
        vehicles,
        drivers,
        customers,
        loads,
        trips,
        expenses,
        documents,
        invoices,
        alerts,
        routeWeights,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error persisting state:', e);
    }
  }, [organization, currentUser, isAuthenticated, vehicles, drivers, customers, loads, trips, expenses, documents, invoices, alerts, routeWeights]);

  const login = (email?: string) => {
    const user: User = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id' | 'organizationId' | 'revenueMonth' | 'fuelCostMonth' | 'tollCostMonth' | 'maintenanceCostMonth' | 'profitMonth' | 'utilizationRate' | 'documents'>): Vehicle => {
    const newId = `veh-${Date.now().toString().slice(-4)}`;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
      organizationId: organization.id,
      revenueMonth: 0,
      fuelCostMonth: 0,
      tollCostMonth: 0,
      maintenanceCostMonth: 0,
      profitMonth: 0,
      utilizationRate: 0,
      documents: [],
      maintenanceHistory: [],
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, status } : v));
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'organizationId' | 'tripNumber'>): Trip => {
    const nextNum = trips.length + 2042;
    const newTrip: Trip = {
      ...tripData,
      id: `trp-${Date.now().toString().slice(-4)}`,
      tripNumber: `TRP-${nextNum}`,
      organizationId: organization.id,
    };
    setTrips(prev => [newTrip, ...prev]);
    
    // Update vehicle status to On Trip
    updateVehicleStatus(tripData.vehicleId, 'On Trip');

    // If assigned to a load, mark load In Transit
    if (tripData.loadId) {
      setLoads(prev => prev.map(l => l.id === tripData.loadId ? { ...l, status: 'In Transit' } : l));
    }

    return newTrip;
  };

  const updateTripStatus = (tripId: string, status: TripStatus) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const updated = { ...t, status };
        if (status === 'Delivered') {
          updated.completedDate = new Date().toISOString();
          // Release vehicle to Available
          updateVehicleStatus(t.vehicleId, 'Available');
        }
        return updated;
      }
      return t;
    }));
  };

  const addLoad = (loadData: Omit<Load, 'id' | 'organizationId' | 'loadNumber'>): Load => {
    const nextNum = loads.length + 1055;
    const newLoad: Load = {
      ...loadData,
      id: `ld-${Date.now().toString().slice(-4)}`,
      loadNumber: `LD-${nextNum}`,
      organizationId: organization.id,
    };
    setLoads(prev => [newLoad, ...prev]);
    return newLoad;
  };

  const assignVehicleToLoad = (loadId: string, vehicleId: string) => {
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) return;

    setLoads(prev => prev.map(l => {
      if (l.id === loadId) {
        return {
          ...l,
          status: 'Assigned',
          assignedVehicleId: targetVehicle.id,
          assignedVehicleReg: targetVehicle.registration,
        };
      }
      return l;
    }));
  };

  const addExpense = (expenseData: Omit<TripExpense, 'id' | 'organizationId'>): TripExpense => {
    const newExpense: TripExpense = {
      ...expenseData,
      id: `exp-${Date.now().toString().slice(-4)}`,
      organizationId: organization.id,
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const addDocument = (docData: Omit<VehicleDocument, 'id' | 'organizationId' | 'daysRemaining' | 'status'>): VehicleDocument => {
    const expiry = new Date(docData.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'Valid' | 'Expiring Soon' | 'Expired' = 'Valid';
    if (diffDays < 0) status = 'Expired';
    else if (diffDays <= 30) status = 'Expiring Soon';

    const newDoc: VehicleDocument = {
      ...docData,
      id: `doc-${Date.now().toString().slice(-4)}`,
      organizationId: organization.id,
      daysRemaining: diffDays,
      status,
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'organizationId' | 'totalTrips' | 'totalRevenue' | 'outstandingAmount'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now().toString().slice(-4)}`,
      organizationId: organization.id,
      totalTrips: 0,
      totalRevenue: 0,
      outstandingAmount: 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'organizationId' | 'invoiceNumber'>): Invoice => {
    const nextNum = invoices.length + 892;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-${nextNum}`,
      organizationId: organization.id,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
  };

  const updateRouteWeights = (weights: RouteScoringWeights) => {
    setRouteWeights(weights);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setVehicles(MOCK_VEHICLES);
    setDrivers(MOCK_DRIVERS);
    setCustomers(MOCK_CUSTOMERS);
    setLoads(MOCK_LOADS);
    setTrips(MOCK_TRIPS);
    setExpenses(MOCK_EXPENSES);
    setDocuments(MOCK_DOCUMENTS);
    setInvoices(MOCK_INVOICES);
    setAlerts(MOCK_ALERTS);
    setRouteWeights(DEFAULT_ROUTE_WEIGHTS);
    setCurrentUser(MOCK_USER);
    setIsAuthenticated(true);
  };

  return (
    <AppContext.Provider
      value={{
        organization,
        currentUser,
        isAuthenticated,
        vehicles,
        drivers,
        customers,
        loads,
        trips,
        expenses,
        documents,
        invoices,
        alerts,
        routeWeights,
        login,
        logout,
        addVehicle,
        updateVehicleStatus,
        createTrip,
        updateTripStatus,
        addLoad,
        assignVehicleToLoad,
        addExpense,
        addDocument,
        addCustomer,
        createInvoice,
        resolveAlert,
        updateRouteWeights,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
