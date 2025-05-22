
import React, { useState, useEffect } from 'react';
import { ConsultationData, PatientData, GenderData, AgeData, APIs } from '@/lib/api';
import ConsultationChart from './ConsultationChart';
import PatientChart from './PatientChart';
import GenderChart from './GenderChart';
import AgeChart from './AgeChart';
import { useToast } from "@/hooks/use-toast";

type ActiveSection = 'consultations' | 'demographic' | 'rx-analytics';

const AnalyticsContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('consultations');
  const [consultationData, setConsultationData] = useState<ConsultationData[]>([]);
  const [patientData, setPatientData] = useState<PatientData[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [ageData, setAgeData] = useState<AgeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch initial data
        if (activeSection === 'consultations') {
          const consultations = await APIs.getConsultationData();
          setConsultationData(consultations);
          const patients = await APIs.getPatientData();
          setPatientData(patients);
        } else if (activeSection === 'demographic') {
          const gender = await APIs.getGenderData();
          setGenderData(gender);
          const age = await APIs.getAgeData();
          setAgeData(age);
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast({
          title: "Error loading data",
          description: "Failed to fetch analytics data. Please try again later.",
          variant: "destructive",
        });
        
        // Fallback to sample data for development purposes
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
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSection, toast]);

  const getButtonClass = (section: ActiveSection) => {
    return activeSection === section
      ? "bg-orange-500 text-white py-2 px-4 rounded"
      : "bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setActiveSection('consultations')}
          className={getButtonClass('consultations')}
        >
          Consultations
        </button>
        <button 
          onClick={() => setActiveSection('demographic')}
          className={getButtonClass('demographic')}
        >
          Demographic
        </button>
        <button 
          onClick={() => setActiveSection('rx-analytics')}
          className={getButtonClass('rx-analytics')}
        >
          Rx Analytics
        </button>
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
            <div className="h-60 flex items-center justify-center">
              <p className="text-gray-500">Rx Analytics data will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsContent;
