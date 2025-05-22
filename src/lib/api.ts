
// API Integration
const API_URL = import.meta.env.VITE_API_URL || "https://api.example.com";
const API_KEY = import.meta.env.VITE_API_KEY || "dummy_api_key";

type FetchOptions = {
  endpoint: string;
  params?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
}

export async function fetchData<T>({ endpoint, params = {}, method = 'GET', body }: FetchOptions): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  
  // Add query parameters
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    // Fallback to mock data for development purposes
    throw error;
  }
}

// Types for our API responses
export interface ConsultationData {
  week: string;
  mar: number;
  apr: number;
  may: number;
}

export interface PatientData {
  week: string;
  mar: number;
  apr: number;
  may: number;
}

export interface GenderData {
  month: string;
  males: number;
  females: number;
  others: number;
}

export interface AgeData {
  ageGroup: string;
  mar: number;
  apr: number;
  may: number;
}

export interface BillingData {
  date: string;
  amount: number;
}

export interface AppointmentData {
  date: string;
  approved: number;
  cancelled: number;
  completed: number;
  total: number;
}

export interface ClinicData {
  clinic: string;
  appointments: number;
}

export interface RxData {
  date: string;
  count: number;
}

export interface RegistrationData {
  date: string;
  approved: number;
  cancelled: number;
  discharged: number;
  total: number;
}

// API endpoints
export const APIs = {
  // Analytics Dashboard
  getConsultationData: () => fetchData<ConsultationData[]>({ endpoint: '/analytics/consultations' }),
  getPatientData: () => fetchData<PatientData[]>({ endpoint: '/analytics/patients' }),
  getGenderData: () => fetchData<GenderData[]>({ endpoint: '/analytics/gender' }),
  getAgeData: () => fetchData<AgeData[]>({ endpoint: '/analytics/age-profile' }),
  
  // Clinic Dashboard
  getAppointments: (dateRange: string) => fetchData<AppointmentData[]>({ 
    endpoint: '/clinics/appointments',
    params: { range: dateRange } 
  }),
  getRxData: (dateRange: string) => fetchData<RxData[]>({ 
    endpoint: '/clinics/prescriptions',
    params: { range: dateRange } 
  }),
  getOPDBilling: (dateRange: string) => fetchData<BillingData[]>({ 
    endpoint: '/clinics/opd-billing',
    params: { range: dateRange } 
  }),
  getIPDBilling: (dateRange: string) => fetchData<BillingData[]>({ 
    endpoint: '/clinics/ipd-billing',
    params: { range: dateRange } 
  }),
  getPharmacyBilling: (dateRange: string) => fetchData<BillingData[]>({ 
    endpoint: '/clinics/pharmacy-billing',
    params: { range: dateRange } 
  }),
  getIPDRegistration: (dateRange: string) => fetchData<RegistrationData[]>({ 
    endpoint: '/clinics/ipd-registration',
    params: { range: dateRange } 
  }),
  getClinicData: () => fetchData<ClinicData[]>({ endpoint: '/clinics/statistics' }),
}
