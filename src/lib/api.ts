
// API Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY || "";
const DOCTOR_ID = import.meta.env.VITE_DOCTOR_ID || "00163c3a-06c9-1edf-88aa-376034cb9e31";

// API Endpoints from .env
const CONSULTATION_ALL_CLINIC = import.meta.env.VITE_CONSULTATION_ALL_CLINIC;
const CONSULTATION_CLINIC_WISE = import.meta.env.VITE_CONSULTATION_CLINIC_WISE;
const FOLLOWUP_ALL_CLINIC = import.meta.env.VITE_FOLLOWUP_ALL_CLINIC;
const FOLLOWUP_CLINIC_WISE = import.meta.env.VITE_FOLLOWUP_CLINIC_WISE;
const APPOINTMENTS_ALL = import.meta.env.VITE_APPOINTMENTS_ALL;
const APPOINTMENTS_CLINIC = import.meta.env.VITE_APPOINTMENTS_CLINIC;
const RX_ALL = import.meta.env.VITE_RX_ALL;
const RX_CLINIC = import.meta.env.VITE_RX_CLINIC;
const OPD_BILLING_ALL = import.meta.env.VITE_OPD_BILLING_ALL;
const OPD_BILLING_CLINIC = import.meta.env.VITE_OPD_BILLING_CLINIC;
const IPD_BILLING_ALL = import.meta.env.VITE_IPD_BILLING_ALL;
const IPD_BILLING_CLINIC = import.meta.env.VITE_IPD_BILLING_CLINIC;
const PHARMACY_BILLING_ALL = import.meta.env.VITE_PHARMACY_BILLING_ALL;
const PHARMACY_BILLING_CLINIC = import.meta.env.VITE_PHARMACY_BILLING_CLINIC;

console.log('API Configuration:', {
  BASE_URL: API_BASE_URL,
  APPOINTMENTS_ALL,
  CONSULTATION_ALL_CLINIC
});

type FetchOptions = {
  endpoint: string;
  params?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
}

export async function fetchData<T>({ endpoint, params = {}, method = 'GET', body }: FetchOptions): Promise<T> {
  try {
    // Check if the endpoint is valid
    if (!endpoint) {
      throw new Error('Invalid endpoint URL');
    }
    
    const url = new URL(endpoint);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    console.log(`Fetching from: ${url.toString()}`);
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY ? `Bearer ${API_KEY}` : '',
        // Adding CORS headers to handle cross-origin requests
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      mode: 'cors',
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status}`);
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
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

export interface SymptomData {
  name: string;
  count: number;
}

export interface DiagnosisData {
  name: string;
  count: number;
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Parse API responses into our data formats
const parseConsultationData = (apiData: any[]): ConsultationData[] => {
  // Group by week and count prescriptions
  const weekData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const prescriptionDate = new Date(item.PrescriptionDate);
    const weekNumber = Math.ceil((prescriptionDate.getDate()) / 7);
    const weekKey = `Week ${weekNumber}`;
    const month = prescriptionDate.getMonth() + 1;
    
    if (!weekData[weekKey]) {
      weekData[weekKey] = { week: weekKey, mar: 0, apr: 0, may: 0 };
    }
    
    if (month === 3) weekData[weekKey].mar++;
    else if (month === 4) weekData[weekKey].apr++;
    else if (month === 5) weekData[weekKey].may++;
  });
  
  return Object.values(weekData);
};

const parsePatientData = (apiData: any[]): PatientData[] => {
  // Group by week and count follow-up patients
  const weekData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const appointmentDate = new Date(item.AppointmentDate);
    const weekNumber = Math.ceil((appointmentDate.getDate()) / 7);
    const weekKey = `Week ${weekNumber}`;
    const month = appointmentDate.getMonth() + 1;
    
    if (!weekData[weekKey]) {
      weekData[weekKey] = { week: weekKey, mar: 0, apr: 0, may: 0 };
    }
    
    if (month === 3) weekData[weekKey].mar++;
    else if (month === 4) weekData[weekKey].apr++;
    else if (month === 5) weekData[weekKey].may++;
  });
  
  return Object.values(weekData);
};

const parseGenderData = (apiData: any[]): GenderData[] => {
  // Group by month and count gender
  const monthData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const prescriptionDate = new Date(item.PrescriptionDate);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthKey = monthNames[prescriptionDate.getMonth()];
    
    if (!monthData[monthKey]) {
      monthData[monthKey] = { month: monthKey, males: 0, females: 0, others: 0 };
    }
    
    if (item.Gender === 'M') monthData[monthKey].males++;
    else if (item.Gender === 'F') monthData[monthKey].females++;
    else monthData[monthKey].others++;
  });
  
  return Object.values(monthData);
};

const parseAgeData = (apiData: any[]): AgeData[] => {
  // Group by age range and count
  const ageData: Record<string, any> = {
    "(0-10)": { ageGroup: "(0-10)", mar: 0, apr: 0, may: 0 },
    "(11-25)": { ageGroup: "(11-25)", mar: 0, apr: 0, may: 0 },
    "(26-40)": { ageGroup: "(26-40)", mar: 0, apr: 0, may: 0 },
    "(41-59)": { ageGroup: "(41-59)", mar: 0, apr: 0, may: 0 },
    "60+": { ageGroup: "60+", mar: 0, apr: 0, may: 0 }
  };
  
  apiData.forEach(item => {
    const prescriptionDate = new Date(item.PrescriptionDate);
    const month = prescriptionDate.getMonth() + 1;
    const age = parseInt(item.Age);
    
    let ageGroup;
    if (age <= 10) ageGroup = "(0-10)";
    else if (age <= 25) ageGroup = "(11-25)";
    else if (age <= 40) ageGroup = "(26-40)";
    else if (age <= 59) ageGroup = "(41-59)";
    else ageGroup = "60+";
    
    if (month === 3) ageData[ageGroup].mar++;
    else if (month === 4) ageData[ageGroup].apr++;
    else if (month === 5) ageData[ageGroup].may++;
  });
  
  return Object.values(ageData);
};

const parseAppointmentData = (apiData: any[]): AppointmentData[] => {
  // Group by date and count appointment statuses
  const dateData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const appointmentDate = new Date(item.AppointmentDate);
    const dateKey = `${appointmentDate.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][appointmentDate.getMonth()]}`;
    
    if (!dateData[dateKey]) {
      dateData[dateKey] = { date: dateKey, approved: 0, cancelled: 0, completed: 0, total: 0 };
    }
    
    dateData[dateKey].total++;
    
    if (item.BookingStatus === 'A') dateData[dateKey].approved++;
    else if (item.BookingStatus === 'C') dateData[dateKey].cancelled++;
    else if (item.BookingStatus === 'D') dateData[dateKey].completed++;
  });
  
  return Object.values(dateData);
};

const parseRxData = (apiData: any[]): RxData[] => {
  // Group by date and count prescriptions
  const dateData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const prescriptionDate = new Date(item.PrescriptionDate);
    const dateKey = `${prescriptionDate.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][prescriptionDate.getMonth()]}`;
    
    if (!dateData[dateKey]) {
      dateData[dateKey] = { date: dateKey, count: 0 };
    }
    
    dateData[dateKey].count++;
  });
  
  return Object.values(dateData);
};

const parseBillingData = (apiData: any[]): BillingData[] => {
  // Group by date and sum amounts
  const dateData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const billDate = new Date(item.BillDate);
    const dateKey = `${billDate.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][billDate.getMonth()]}`;
    
    if (!dateData[dateKey]) {
      dateData[dateKey] = { date: dateKey, amount: 0 };
    }
    
    // Use GrossAmount or PaymentReceived based on what's available
    const amount = item.GrossAmount ? parseFloat(item.GrossAmount) : 
                  (item.PaymentReceived ? parseFloat(item.PaymentReceived) : 0);
    
    dateData[dateKey].amount += amount;
  });
  
  return Object.values(dateData);
};

const parseRegistrationData = (apiData: any[]): RegistrationData[] => {
  // Group by date and count registration statuses
  const dateData: Record<string, any> = {};
  
  apiData.forEach(item => {
    const admissionDate = new Date(item.AdmissionDate);
    const dateKey = `${admissionDate.getDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][admissionDate.getMonth()]}`;
    
    if (!dateData[dateKey]) {
      dateData[dateKey] = { date: dateKey, approved: 0, cancelled: 0, discharged: 0, total: 0 };
    }
    
    dateData[dateKey].total++;
    
    if (item.IPDStatus === 'A') dateData[dateKey].approved++;
    else if (item.IPDStatus === 'C') dateData[dateKey].cancelled++;
    else if (item.IPDStatus === 'D') dateData[dateKey].discharged++;
  });
  
  return Object.values(dateData);
};

// API endpoints
export const APIs = {
  // Clinics Dashboard
  getConsultationData: async (startDate: string, endDate: string, clinicId?: string): Promise<ConsultationData[]> => {
    try {
      const endpoint = CONSULTATION_ALL_CLINIC;
      if (!endpoint) {
        console.error("Consultation endpoint URL not found in environment variables");
        throw new Error('Consultation endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and IPDID eq guid'00000000-0000-0000-0000-000000000000' and PrescriptionDate ne ''`;
      
      if (clinicId) {
        filter = `(ClinicID eq guid'${clinicId}' or AppointmentClinicID eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and PrescriptionDate ne ''`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=PrescriptionDate,UserID,Gender,Age,AgeUnit,DOB`
      });
      
      return parseConsultationData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getConsultationData:", error);
      throw error;
    }
  },
  
  getPatientData: async (startDate: string, endDate: string, clinicId?: string): Promise<PatientData[]> => {
    try {
      const endpoint = FOLLOWUP_ALL_CLINIC;
      if (!endpoint) {
        throw new Error('Follow-up endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${startDate}' and AppointmentDate le '${endDate}' and AppointmentDate ne '' and BookingStatus eq 'D' and FollowUp eq true`;
      
      if (clinicId) {
        filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${startDate}' and AppointmentDate le '${endDate}' and AppointmentDate ne '' and BookingStatus eq 'D' and FollowUp eq true`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=AppointmentDate,FollowUp`
      });
      
      return parsePatientData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getPatientData:", error);
      throw error;
    }
  },
  
  getGenderData: async (startDate: string, endDate: string): Promise<GenderData[]> => {
    try {
      const endpoint = CONSULTATION_ALL_CLINIC;
      if (!endpoint) {
        throw new Error('Consultation endpoint URL not found');
      }
      
      const filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and IPDID eq guid'00000000-0000-0000-0000-000000000000' and PrescriptionDate ne ''`;
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=PrescriptionDate,Gender`
      });
      
      return parseGenderData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getGenderData:", error);
      throw error;
    }
  },
  
  getAgeData: async (startDate: string, endDate: string): Promise<AgeData[]> => {
    try {
      const endpoint = CONSULTATION_ALL_CLINIC;
      if (!endpoint) {
        throw new Error('Consultation endpoint URL not found');
      }
      
      const filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and IPDID eq guid'00000000-0000-0000-0000-000000000000' and PrescriptionDate ne ''`;
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=PrescriptionDate,Age,AgeUnit`
      });
      
      return parseAgeData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getAgeData:", error);
      throw error;
    }
  },
  
  getSymptomData: async (): Promise<SymptomData[]> => {
    try {
      const endpoint = RX_ALL;
      if (!endpoint) {
        throw new Error('Rx endpoint URL not found');
      }
      
      const now = new Date();
      const startDate = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      const endDate = formatDateToYYYYMMDD(now);
      
      const filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and PrescriptionDate ne ''`;
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=Symptom,PrescriptionDate`
      });
      
      // Count symptoms
      const symptomCounts: Record<string, number> = {};
      response.d?.results.forEach((item: any) => {
        if (item.Symptom) {
          if (!symptomCounts[item.Symptom]) {
            symptomCounts[item.Symptom] = 0;
          }
          symptomCounts[item.Symptom]++;
        }
      });
      
      // Convert to array and sort
      return Object.entries(symptomCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 symptoms
    } catch (error) {
      console.error("Error in getSymptomData:", error);
      throw error;
    }
  },
  
  getDiagnosisData: async (): Promise<DiagnosisData[]> => {
    try {
      const endpoint = RX_ALL;
      if (!endpoint) {
        throw new Error('Rx endpoint URL not found');
      }
      
      const now = new Date();
      const startDate = formatDateToYYYYMMDD(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      const endDate = formatDateToYYYYMMDD(now);
      
      const filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and PrescriptionDate ne ''`;
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=Diagnosis,PrescriptionDate`
      });
      
      // Count diagnosis
      const diagnosisCounts: Record<string, number> = {};
      response.d?.results.forEach((item: any) => {
        if (item.Diagnosis) {
          if (!diagnosisCounts[item.Diagnosis]) {
            diagnosisCounts[item.Diagnosis] = 0;
          }
          diagnosisCounts[item.Diagnosis]++;
        }
      });
      
      // Convert to array and sort
      return Object.entries(diagnosisCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 diagnoses
    } catch (error) {
      console.error("Error in getDiagnosisData:", error);
      throw error;
    }
  },
  
  // Analytics Dashboard
  getAppointments: async (dateRange: string, clinicId?: string): Promise<AppointmentData[]> => {
    try {
      // Parse dateRange to get actual start and end dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const endpoint = APPOINTMENTS_ALL;
      if (!endpoint) {
        console.error("Appointments endpoint URL not found in environment variables");
        throw new Error('Appointments endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${formattedStartDate}' and AppointmentDate le '${formattedEndDate}' and AppointmentDate ne ''`;
      
      if (clinicId) {
        filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${formattedStartDate}' and AppointmentDate le '${formattedEndDate}' and AppointmentDate ne ''`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$filter=${filter}&$select=AppointmentDate,BookingStatus,FollowUp,ClinicID,ClinicName,DoctorID,DoctorName`
      });
      
      return parseAppointmentData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getAppointments:", error);
      throw error;
    }
  },
  
  getRxData: async (dateRange: string, clinicId?: string): Promise<RxData[]> => {
    try {
      // Parse dateRange to get actual dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const endpoint = RX_ALL;
      if (!endpoint) {
        throw new Error('Rx endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${formattedStartDate}' and PrescriptionDate le '${formattedEndDate}' and PrescriptionDate ne ''`;
      
      if (clinicId) {
        filter = `(ClinicID eq guid'${clinicId}' or AppointmentClinicID eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${formattedStartDate}' and PrescriptionDate le '${formattedEndDate}' and PrescriptionDate ne ''`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$expand=&$filter=${filter}&$select=PrescriptionDate,ClinicID,AppointmentClinicID,DoctorID,DoctorName&$orderby=PrescriptionDate desc`
      });
      
      return parseRxData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getRxData:", error);
      throw error;
    }
  },
  
  getOPDBilling: async (dateRange: string, clinicId?: string): Promise<BillingData[]> => {
    try {
      // Parse dateRange to get actual dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const endpoint = OPD_BILLING_ALL;
      if (!endpoint) {
        throw new Error('OPD Billing endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and BillType ne 'P' and IPDID eq guid'00000000-0000-0000-0000-000000000000'`;
      
      if (clinicId) {
        filter = `(ClinicID eq guid'${clinicId}' or to_PRESCRIPTION/clinic_id eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and BillType ne 'P' and IPDID eq guid'00000000-0000-0000-0000-000000000000'`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$expand=to_PRESCRIPTION&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName,to_PRESCRIPTION/clinic_id&$orderby=BillDate desc`
      });
      
      return parseBillingData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getOPDBilling:", error);
      throw error;
    }
  },
  
  getIPDBilling: async (dateRange: string, clinicId?: string): Promise<BillingData[]> => {
    try {
      // Parse dateRange to get actual dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const endpoint = IPD_BILLING_ALL;
      if (!endpoint) {
        throw new Error('IPD Billing endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and IPDID ne guid'00000000-0000-0000-0000-000000000000'`;
      
      if (clinicId) {
        filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and IPDID ne guid'00000000-0000-0000-0000-000000000000'`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$expand=&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName&$orderby=BillDate desc`
      });
      
      return parseBillingData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getIPDBilling:", error);
      throw error;
    }
  },
  
  getPharmacyBilling: async (dateRange: string, clinicId?: string): Promise<BillingData[]> => {
    try {
      // Parse dateRange to get actual dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const endpoint = PHARMACY_BILLING_ALL;
      if (!endpoint) {
        throw new Error('Pharmacy Billing endpoint URL not found');
      }
      
      let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and BillType eq 'P'`;
      
      if (clinicId) {
        filter = `(ClinicID eq guid'${clinicId}' or to_PRESCRIPTION/clinic_id eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formattedStartDate}' and BillDate le '${formattedEndDate}' and BillDate ne '' and BillType eq 'P'`;
      }
      
      const response = await fetchData<any>({ 
        endpoint: `${endpoint}?$expand=to_PRESCRIPTION&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName,to_PRESCRIPTION/clinic_id&$orderby=BillDate desc`
      });
      
      return parseBillingData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getPharmacyBilling:", error);
      throw error;
    }
  },
  
  getIPDRegistration: async (dateRange: string): Promise<RegistrationData[]> => {
    try {
      // Parse dateRange to get actual dates
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === '7days') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30days') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90days') {
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
      
      const formattedStartDate = formatDateToYYYYMMDD(startDate);
      const formattedEndDate = formatDateToYYYYMMDD(now);
      
      const baseUrl = '/sap/opu/odata/sap/ZCDS_C_IPD_REGISTRATION_CDS/ZCDS_C_IPD_REGISTRATION';
      const filter = `DoctorID eq guid'${DOCTOR_ID}' and AdmissionDate ge '${formattedStartDate}' and AdmissionDate le '${formattedEndDate}' and AdmissionDate ne ''`;
      
      const response = await fetchData<any>({ 
        endpoint: `${baseUrl}?$expand=to_DOCTOR,to_HOSPITAL,to_DOCTORINCHARGE,to_CONSULTINGDOCTOR&$filter=${filter}&$select=AdmissionDate,IPDStatus,to_DOCTOR/Name,to_HOSPITAL/Name,to_DOCTORINCHARGE/Name,to_CONSULTINGDOCTOR/Name&$orderby=AdmissionDate desc`
      });
      
      return parseRegistrationData(response.d?.results || []);
    } catch (error) {
      console.error("Error in getIPDRegistration:", error);
      throw error;
    }
  },
}
