
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AppointmentData } from '@/lib/api';
import DateRangeSelector from './DateRangeSelector';

interface AppointmentChartProps {
  data: AppointmentData[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const AppointmentChart: React.FC<AppointmentChartProps> = ({ 
  data, 
  dateRange, 
  onDateRangeChange 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center">
        <CardTitle className="text-base font-medium">Appointments</CardTitle>
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
              <Bar dataKey="completed" name="Completed" fill="#4ED7CF" />
              <Bar dataKey="total" name="Total" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mb-2 font-medium">Monthly Wise</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { month: 'May 2025', approved: 17, cancelled: 0, completed: 9, total: 27 }
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
              <Bar dataKey="completed" name="Completed" fill="#4ED7CF" />
              <Bar dataKey="total" name="Total" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mb-2 font-medium">Clinic Wise</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { clinic: 'May 2025', "Ayashu Clinic": 23, "Radha Hospital": 4 }
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="clinic" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ayashu Clinic" fill="#FF6348" />
              <Bar dataKey="Radha Hospital" fill="#9747FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentChart;
