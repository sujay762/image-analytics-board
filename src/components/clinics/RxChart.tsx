
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RxData } from '@/lib/api';
import DateRangeSelector from './DateRangeSelector';

interface RxChartProps {
  data: RxData[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const RxChart: React.FC<RxChartProps> = ({ data, dateRange, onDateRangeChange }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center">
        <CardTitle className="text-base font-medium">Rx</CardTitle>
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
              <Bar dataKey="count" name="Total Rx | 25" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="mb-2 font-medium">Monthly Wise</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[{ month: 'May 2025', count: 25 }]}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" name="Total Rx" fill="#00A3FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RxChart;
