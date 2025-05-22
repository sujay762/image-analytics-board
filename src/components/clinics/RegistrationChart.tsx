
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { RegistrationData } from '@/lib/api';
import DateRangeSelector from './DateRangeSelector';

interface RegistrationChartProps {
  data: RegistrationData[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const RegistrationChart: React.FC<RegistrationChartProps> = ({ 
  data, 
  dateRange, 
  onDateRangeChange 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center">
        <CardTitle className="text-base font-medium">IPD Registration</CardTitle>
        <DateRangeSelector value={dateRange} onChange={onDateRangeChange} />
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 font-medium">Days Wise</h3>
        <div className="h-60 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#00C49F" />
              <Bar dataKey="cancelled" name="Cancelled" fill="#FF6B6B" />
              <Bar dataKey="discharged" name="Discharged" fill="#4ED7CF" />
              <Bar dataKey="total" name="Total" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mb-2 font-medium">Monthly Wise</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { month: 'May 2025', approved: 0, cancelled: 0, discharged: 2, total: 2 }
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#00C49F" />
              <Bar dataKey="cancelled" name="Cancelled" fill="#FF6B6B" />
              <Bar dataKey="discharged" name="Discharged" fill="#4ED7CF" />
              <Bar dataKey="total" name="Total" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationChart;
