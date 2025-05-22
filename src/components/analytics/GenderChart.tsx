
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GenderData } from '@/lib/api';

interface GenderChartProps {
  data: GenderData[];
}

const GenderChart: React.FC<GenderChartProps> = ({ data }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Gender Profile from 01-Mar-2025 to 20-May-2025
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="males" name="Males" fill="#9CA3AF" />
              <Bar dataKey="females" name="Females" fill="#0000AA" />
              <Bar dataKey="others" name="Others" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenderChart;
