
import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { ScheduleForm } from '@/components/schedules/ScheduleForm';
import { ScheduleCalendar, ScheduleEvent } from '@/components/schedules/ScheduleCalendar';
import { useToast } from '@/components/ui/use-toast';

import employeeManagementService from '@/services/employeeManagementService';
import scheduleManagementService from '@/services/scheduleManagementService';


const SchedulesPage = () => {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  async function fetchEmployees() {
    try {
      const data = await employeeManagementService.getAllEmployees();
      const formatted = data.map((emp: any) => ({
        id: emp.id.toString(),
        name: `${emp.employeeFirstName} ${emp.employeeLastName}`,
      }));
      setEmployees(formatted);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  async function fetchSchedules(date: Date) {
    setIsLoading(true);
    try {
      const isoDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const data = await scheduleManagementService.getScheduleOfAllEmployees(isoDate);
  
      const formatted: ScheduleEvent[] = data.map((item: any) => ({
        id: item.scheduleId.toString(),
        title: `${item.scheduleName} - (${item.employeeFirstName} ${item.employeeLastName})`,
        date: new Date(item.date),
        startTime: item.checkinTime.slice(0, 5),
        endTime: item.checkoutTime.slice(0, 5),
        breakStartTime: item.breakStartTime.slice(0, 5),
        breakEndTime: item.breakEndTime.slice(0, 5),
      }));
  
      setSchedules(formatted);
    } catch (error) {
      toast({
        title: "Error fetching schedules",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
    fetchSchedules(new Date());
  }, [])

  const handleAddSchedule = async (data: { 
    title?: string; 
    date?: Date; 
    startTime?: string; 
    endTime?: string; 
    breakStartTime?: string;
    breakEndTime?: string;
    employeeIds?: string[]; 
    recurringType?: string; 
  }) => {

    console.log(data)    
    const scheduleObject = {
      employees_ids: data.employeeIds.map((id) => parseInt(id, 10)),
      schedule: {
        scheduleName: data.title,
        date: data.date?.toISOString().split('T')[0],
        checkinTime: data.startTime,
        checkoutTime: data.endTime,
        breakStartTime: data.breakStartTime,
        breakEndTime: data.breakEndTime,
        isDayOff: false,
        recurringType: data.recurringType.toUpperCase() || "NONE",
      }
    }
    console.log("Schedule Object:", scheduleObject);
    
    try {
      await scheduleManagementService.addScheduleToEmployees(scheduleObject)
        .then(() => {
          toast({ title: "Success", description: "Schedule created successfully", variant: "default" });
        })
        .catch((error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Schedules</h2>
            <p className="text-muted-foreground">Create and manage employee schedules.</p>
          </div>
          <ScheduleForm onSubmit={handleAddSchedule} employees={employees} />
        </div>

        <ScheduleCalendar schedules={schedules} onSelectDate={fetchSchedules}/>
      </div>
    </SidebarLayout>
  );
};

export default SchedulesPage;
