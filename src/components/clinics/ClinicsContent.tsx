
import React, { useState, useEffect } from 'react';
import { 
  ConsultationData, 
  PatientData, 
  GenderData, 
  AgeData,
  SymptomData,
  DiagnosisData,
  APIs
} from '@/lib/api';
import ConsultationChart from '@/components/analytics/ConsultationChart';
import PatientChart from '@/components/analytics/PatientChart';
import GenderChart from '@/components/analytics/GenderChart';
import AgeChart from '@/components/analytics/AgeChart';
import SymptomChart from '@/components/analytics/SymptomChart';
import DiagnosisChart from '@/components/analytics/DiagnosisChart';
import { useToast } from "@/hooks/use-toast";

type ActiveSection = 'consultations' | 'demographic' | 'rx-analytics';

const ClinicsContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('consultations');
  const [consultationData, setConsultationData] = useState<ConsultationData[]>([]);
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [ageData, setAgeData] = useState<AgeData[]>([]);
  const [symptomData, setSymptomData] = useState<SymptomData[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState({
    startDate: '20250201',
    endDate: '20250523'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch initial data
        if (activeSection === 'consultations') {
          const consultations = await APIs.getConsultationData(dateRange.startDate, dateRange.endDate);
          setConsultationData(consultations);
          const patients = await APIs.getPatientData(dateRange.startDate, dateRange.endDate);
          setPatientData(patients);
        } else if (activeSection === 'demographic') {
          const gender = await APIs.getGenderData(dateRange.startDate, dateRange.endDate);
          setGenderData(gender);
          const age = await APIs.getAgeData(dateRange.startDate, dateRange.endDate);
          setAgeData(age);
        } else if (activeSection === 'rx-analytics') {
          const symptoms = await APIs.getSymptomData();
          setSymptomData(symptoms);
          const diagnosis = await APIs.getDiagnosisData();
          setDiagnosisData(diagnosis);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to fetch analytics data. Using sample data instead.",
          variant: "destructive",
        });
        
        // Fallback to sample data for development purposes
        provideFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, toast, dateRange]);

  const provideFallbackData = () => {
    if (activeSection === 'consultations') {
      setConsultationData([
        { week: 'Week 1', mar: 26, apr: 20, may: 35 },
        { week: 'Week 2', mar: 35, apr: 35, may: 17 },
        { week: 'Week 3', mar: 8, apr: 26, may: 18 },
        { week: 'Week 4', mar: 25, apr: 29, may: 0 },
      ]);
      setPatientData([
        { week: 'Week 1', mar: 12, apr: 5, may: 8 },
        { week: 'Week 2', mar: 12, apr: 13, may: 3 },
        { week: 'Week 3', mar: 6, apr: 9, may: 9 },
        { week: 'Week 4', mar: 13, apr: 10, may: 0 },
      ]);
    } else if (activeSection === 'demographic') {
      setGenderData([
        { month: 'Mar', males: 55, females: 23, others: 14 },
        { month: 'Apr', males: 74, females: 36, others: 0 },
        { month: 'May', males: 54, females: 15, others: 1 },
      ]);
      setAgeData([
        { ageGroup: '(0-10)', mar: 26, apr: 40, may: 26 },
        { ageGroup: '(11-25)', mar: 2, apr: 8, may: 8 },
        { ageGroup: '(26-40)', mar: 58, apr: 47, may: 33 },
        { ageGroup: '(41-59)', mar: 4, apr: 8, may: 1 },
      ]);
    } else if (activeSection === 'rx-analytics') {
      setSymptomData([
        { name: 'COUGH', count: 47 },
        { name: 'FEVER', count: 43 },
        { name: 'MILD FEVER', count: 30 },
        { name: 'SYNCOPE', count: 28 },
        { name: 'HIGH FEVER', count: 25 },
        { name: 'FREQUENCY/URGENCY/NOCTURIA', count: 18 },
        { name: 'FEVER WITH RASH/DIARRHOEA', count: 12 },
        { name: 'MILD DIARRHOEA', count: 12 },
        { name: 'MILD ACIDITY', count: 11 },
        { name: 'FEVER/CHILLS', count: 7 }
      ]);
      setDiagnosisData([
        { name: 'YELLOW FEVER', count: 56 },
        { name: 'COUGH', count: 25 },
        { name: 'ACUTE FEVER WITH NO RASH', count: 11 },
        { name: 'ACUTE FEVER WITH RASH', count: 10 },
        { name: 'CHIKUNGUNYA ARTHRITIS AND VIREMIA', count: 6 },
        { name: 'ALLERGIC RHINAN', count: 6 },
        { name: 'NORMAL PREGNANCY', count: 5 },
        { name: 'SALLMONELA TYPHI VACCINE', count: 5 },
        { name: 'VIRAL FEVER', count: 4 },
        { name: 'ACUTE FEBRILE ILLENESS ANDDENQUE', count: 2 }
      ]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['consultations', 'demographic', 'rx-analytics'].map((section) => (
          <button 
            key={section}
            onClick={() => setActiveSection(section as ActiveSection)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${activeSection === section 
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
          >
            {section === 'consultations' ? 'Consultations' : 
             section === 'demographic' ? 'Demographic' : 'Rx Analytics'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSection === 'consultations' && (
            <>
              <ConsultationChart data={consultationData} />
              <PatientChart data={patientData} />
            </>
          )}

          {activeSection === 'demographic' && (
            <>
              <GenderChart data={genderData} />
              <AgeChart data={ageData} />
            </>
          )}

          {activeSection === 'rx-analytics' && (
            <>
              <SymptomChart data={symptomData} />
              <DiagnosisChart data={diagnosisData} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicsContent;
