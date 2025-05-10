import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AttendanceData {
  dayName: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalFree: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">Weekly Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="dayName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalPresent" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="totalAbsent" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="totalLate" stroke="#eab308" strokeWidth={2} />
              <Line type="monotone" dataKey="totalFree" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
