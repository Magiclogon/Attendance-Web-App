
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

interface ScheduleCalendarProps {
  schedules: ScheduleEvent[];
  onSelectDate?: (date: Date | undefined) => void;
}

export function ScheduleCalendar({ schedules, onSelectDate }: ScheduleCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
  
    // Normalize the date to midnight UTC (GMT+0)
    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));
  
    setDate(utcDate);
  
    if (onSelectDate) {
      onSelectDate(utcDate);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="border rounded-md p-3"
            modifiersClassNames={{
              hasSchedule: "border-primary border-2"
            }}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {date ? (
              `Schedules for ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`
            ) : (
              "Select a date to view schedules"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No schedules for this date
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex flex-col gap-2 border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{schedule.title}</h3>
                    <Badge>{schedule.startTime} - {schedule.endTime}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-s">Break time</h3>
                    <Badge className="bg-green-100 text-green-800 border border-green-300">
                      {schedule.breakStartTime} - {schedule.breakEndTime}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
