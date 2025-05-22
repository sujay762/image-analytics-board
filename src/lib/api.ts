
// API Integration
const API_URL = import.meta.env.VITE_API_URL || "http://199.192.26.248:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "";
const DOCTOR_ID = import.meta.env.VITE_DOCTOR_ID || "00163c3a-06c9-1edf-88aa-376034cb9e31";

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

export interface SymptomData {
  name: string;
  count: number;
}

export interface DiagnosisData {
  name: string;
  count: number;
}

// API endpoints
export const APIs = {
  // Analytics Dashboard (former Clinics Dashboard)
  getConsultationData: (startDate: string, endDate: string, clinicId?: string) => {
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_PRESCRIPTION_LIST_CDS/ZCDS_C_PRESCRIPTION_LIST';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and IPDID eq guid'00000000-0000-0000-0000-000000000000' and PrescriptionDate ne ''`;
    
    if (clinicId) {
      filter = `(ClinicID eq guid'${clinicId}' or AppointmentClinicID eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${startDate}' and PrescriptionDate le '${endDate}' and PrescriptionDate ne ''`;
    }
    
    return fetchData<ConsultationData[]>({ 
      endpoint: `${baseUrl}?$filter=${filter}&$select=PrescriptionDate,UserID,Gender,Age,AgeUnit,DOB`
    });
  },
  
  getPatientData: (startDate: string, endDate: string, clinicId?: string) => {
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_DOCTOR_CDS/ZCDS_C_DOCTOR_APPOINTMENT';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${startDate}' and AppointmentDate le '${endDate}' and AppointmentDate ne '' and BookingStatus eq 'D' and FollowUp eq true`;
    
    if (clinicId) {
      filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${startDate}' and AppointmentDate le '${endDate}' and AppointmentDate ne '' and BookingStatus eq 'D' and FollowUp eq true`;
    }
    
    return fetchData<PatientData[]>({ 
      endpoint: `${baseUrl}?$filter=${filter}&$select=AppointmentDate,FollowUp`
    });
  },
  
  getGenderData: () => fetchData<GenderData[]>({ endpoint: '/analytics/gender' }),
  getAgeData: () => fetchData<AgeData[]>({ endpoint: '/analytics/age-profile' }),
  getSymptomData: () => fetchData<SymptomData[]>({ endpoint: '/analytics/symptoms' }),
  getDiagnosisData: () => fetchData<DiagnosisData[]>({ endpoint: '/analytics/diagnosis' }),
  
  // Clinics Dashboard (former Analytics Dashboard)
  getAppointments: (dateRange: string, clinicId?: string) => {
    // Parse dateRange to get actual start and end dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_DOCTOR_CDS/ZCDS_C_DOCTOR_APPOINTMENT';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${formatDate(startDate)}' and AppointmentDate le '${formatDate(endDate)}' and AppointmentDate ne ''`;
    
    if (clinicId) {
      filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and AppointmentDate ge '${formatDate(startDate)}' and AppointmentDate le '${formatDate(endDate)}' and AppointmentDate ne ''`;
    }
    
    return fetchData<AppointmentData[]>({ 
      endpoint: `${baseUrl}?$filter=${filter}&$select=AppointmentDate,BookingStatus,FollowUp,ClinicID,ClinicName,DoctorID,DoctorName`
    });
  },
  
  getRxData: (dateRange: string, clinicId?: string) => {
    // Parse dateRange to get actual dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_PRESCRIPTION_LIST_CDS/ZCDS_C_PRESCRIPTION_LIST';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${formatDate(startDate)}' and PrescriptionDate le '${formatDate(endDate)}' and PrescriptionDate ne ''`;
    
    if (clinicId) {
      filter = `(ClinicID eq guid'${clinicId}' or AppointmentClinicID eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and PrescriptionDate ge '${formatDate(startDate)}' and PrescriptionDate le '${formatDate(endDate)}' and PrescriptionDate ne ''`;
    }
    
    return fetchData<RxData[]>({ 
      endpoint: `${baseUrl}?$expand=&$filter=${filter}&$select=PrescriptionDate,ClinicID,AppointmentClinicID,DoctorID,DoctorName&$orderby=PrescriptionDate desc`
    });
  },
  
  getOPDBilling: (dateRange: string, clinicId?: string) => {
    // Parse dateRange to get actual dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_BILLING_LIST_CDS/ZCDS_C_BILLING_LIST';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and BillType ne 'P' and IPDID eq guid'00000000-0000-0000-0000-000000000000'`;
    
    if (clinicId) {
      filter = `(ClinicID eq guid'${clinicId}' or to_PRESCRIPTION/clinic_id eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and BillType ne 'P' and IPDID eq guid'00000000-0000-0000-0000-000000000000'`;
    }
    
    return fetchData<BillingData[]>({ 
      endpoint: `${baseUrl}?$expand=to_PRESCRIPTION&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName,to_PRESCRIPTION/clinic_id&$orderby=BillDate desc`
    });
  },
  
  getIPDBilling: (dateRange: string, clinicId?: string) => {
    // Parse dateRange to get actual dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_IPD_REGISTRATION_CDS/ZCDS_C_BILLING_LIST';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and IPDID ne guid'00000000-0000-0000-0000-000000000000'`;
    
    if (clinicId) {
      filter = `ClinicID eq guid'${clinicId}' and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and IPDID ne guid'00000000-0000-0000-0000-000000000000'`;
    }
    
    return fetchData<BillingData[]>({ 
      endpoint: `${baseUrl}?$expand=&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName&$orderby=BillDate desc`
    });
  },
  
  getPharmacyBilling: (dateRange: string, clinicId?: string) => {
    // Parse dateRange to get actual dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_BILLING_LIST_CDS/ZCDS_C_BILLING_LIST';
    let filter = `DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and BillType eq 'P'`;
    
    if (clinicId) {
      filter = `(ClinicID eq guid'${clinicId}' or to_PRESCRIPTION/clinic_id eq guid'${clinicId}') and DoctorID eq guid'${DOCTOR_ID}' and BillDate ge '${formatDate(startDate)}' and BillDate le '${formatDate(endDate)}' and BillDate ne '' and BillType eq 'P'`;
    }
    
    return fetchData<BillingData[]>({ 
      endpoint: `${baseUrl}?$expand=to_PRESCRIPTION&$filter=${filter}&$select=BillDate,GrossAmount,PaymentReceived,ClinicID,DoctorID,DoctorName,to_PRESCRIPTION/clinic_id&$orderby=BillDate desc`
    });
  },
  
  getIPDRegistration: (dateRange: string) => {
    // Parse dateRange to get actual dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (dateRange === '7days') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '30days') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90days') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    };
    
    const baseUrl = '/sap/opu/odata/sap/ZCDS_C_IPD_REGISTRATION_CDS/ZCDS_C_IPD_REGISTRATION';
    const filter = `DoctorID eq guid'${DOCTOR_ID}' and AdmissionDate ge '${formatDate(startDate)}' and AdmissionDate le '${formatDate(endDate)}' and AdmissionDate ne ''`;
    
    return fetchData<RegistrationData[]>({ 
      endpoint: `${baseUrl}?$expand=to_DOCTOR,to_HOSPITAL,to_DOCTORINCHARGE,to_CONSULTINGDOCTOR&$filter=${filter}&$select=AdmissionDate,IPDStatus,to_DOCTOR/Name,to_HOSPITAL/Name,to_DOCTORINCHARGE/Name,to_CONSULTINGDOCTOR/Name&$orderby=AdmissionDate desc`
    });
  },
  
  getClinicData: () => fetchData<ClinicData[]>({ endpoint: '/clinics/statistics' }),
}
