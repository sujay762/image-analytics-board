
import React, { useState, useEffect } from 'react';
import { 
  AppointmentData, 
  RxData, 
  BillingData, 
  RegistrationData, 
  APIs
} from '@/lib/api';
import AppointmentChart from './AppointmentChart';
import RxChart from './RxChart';
import BillingChart from './BillingChart';
import RegistrationChart from './RegistrationChart';
import { useToast } from "@/hooks/use-toast";

type ActiveSection = 'appointment' | 'rx' | 'opd-billing' | 'ipd-billing' | 'pharmacy-billing' | 'ipd-registration';

const ClinicsContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('appointment');
  const [dateRange, setDateRange] = useState<string>('7days');
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  const [rxData, setRxData] = useState<RxData[]>([]);
  const [opdBillingData, setOPDBillingData] = useState<BillingData[]>([]);
  const [ipdBillingData, setIPDBillingData] = useState<BillingData[]>([]);
  const [pharmacyBillingData, setPharmacyBillingData] = useState<BillingData[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data based on active section
        switch (activeSection) {
          case 'appointment':
            const appointments = await APIs.getAppointments(dateRange);
            setAppointmentData(appointments);
            break;
          case 'rx':
            const rx = await APIs.getRxData(dateRange);
            setRxData(rx);
            break;
          case 'opd-billing':
            const opdBilling = await APIs.getOPDBilling(dateRange);
            setOPDBillingData(opdBilling);
            break;
          case 'ipd-billing':
            const ipdBilling = await APIs.getIPDBilling(dateRange);
            setIPDBillingData(ipdBilling);
            break;
          case 'pharmacy-billing':
            const pharmacyBilling = await APIs.getPharmacyBilling(dateRange);
            setPharmacyBillingData(pharmacyBilling);
            break;
          case 'ipd-registration':
            const registration = await APIs.getIPDRegistration(dateRange);
            setRegistrationData(registration);
            break;
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeSection} data:`, error);
        toast({
          title: "Error loading data",
          description: `Failed to fetch ${activeSection} data. Using sample data instead.`,
          variant: "destructive",
        });
        
        // Fallback data for development
        provideFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, dateRange, toast]);

  const provideFallbackData = () => {
    switch (activeSection) {
      case 'appointment':
        setAppointmentData([
          { date: '13 May', approved: 1, cancelled: 0, completed: 1, total: 2 },
          { date: '14 May', approved: 7, cancelled: 0, completed: 0, total: 7 },
          { date: '15 May', approved: 1, cancelled: 0, completed: 1, total: 2 },
          { date: '16 May', approved: 2, cancelled: 0, completed: 1, total: 3 }
        ]);
        break;
      case 'rx':
        setRxData([
          { date: '13 May', count: 1 },
          { date: '15 May', count: 1 },
          { date: '16 May', count: 15 },
          { date: '17 May', count: 3 },
          { date: '19 May', count: 5 }
        ]);
        break;
      case 'opd-billing':
        setOPDBillingData([
          { date: '13 May', amount: 1626 },
          { date: '14 May', amount: 6355 },
          { date: '15 May', amount: 3334 },
          { date: '16 May', amount: 6183 },
          { date: '17 May', amount: 4752 },
          { date: '19 May', amount: 3034 }
        ]);
        break;
      case 'ipd-billing':
        setIPDBillingData([
          { date: '16 May', amount: 6700 }
        ]);
        break;
      case 'pharmacy-billing':
        setPharmacyBillingData([
          { date: '14 May', amount: 296 },
          { date: '16 May', amount: 1906 },
          { date: '19 May', amount: 6337 }
        ]);
        break;
      case 'ipd-registration':
        setRegistrationData([
          { date: '16 May', approved: 0, cancelled: 0, discharged: 2, total: 2 }
        ]);
        break;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {['appointment', 'rx', 'opd-billing', 'ipd-billing', 'pharmacy-billing', 'ipd-registration'].map((section) => (
          <button 
            key={section}
            onClick={() => setActiveSection(section as ActiveSection)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium
              ${activeSection === section 
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
          >
            {section === 'appointment' ? 'Appointment' : 
             section === 'rx' ? 'Rx' : 
             section === 'opd-billing' ? 'OPD Billing' : 
             section === 'ipd-billing' ? 'IPD Billing' : 
             section === 'pharmacy-billing' ? 'Pharmacy Billing' : 'IPD Registration'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div>
          {activeSection === 'appointment' && (
            <AppointmentChart 
              data={appointmentData} 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {activeSection === 'rx' && (
            <RxChart 
              data={rxData} 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {activeSection === 'opd-billing' && (
            <BillingChart 
              data={opdBillingData}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              type="OPD"
              total={calculateTotal(opdBillingData)}
            />
          )}

          {activeSection === 'ipd-billing' && (
            <BillingChart 
              data={ipdBillingData}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              type="IPD"
              total={calculateTotal(ipdBillingData)}
            />
          )}

          {activeSection === 'pharmacy-billing' && (
            <BillingChart 
              data={pharmacyBillingData}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              type="Pharmacy"
              total={calculateTotal(pharmacyBillingData)}
            />
          )}

          {activeSection === 'ipd-registration' && (
            <RegistrationChart 
              data={registrationData}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
        </div>
      )}
    </div>
  );

  // Helper function to calculate total
  function calculateTotal(data: BillingData[]): number {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }
};

export default ClinicsContent;
