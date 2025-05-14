
import React, { useEffect, useState } from 'react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { AttendanceTable, AttendanceRecord } from '@/components/attendance/AttendanceTable';
import { AttendanceForm } from '@/components/attendance/AttendanceForm';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';

import attendanceManagementService from '@/services/attendanceManagementService';


const AttendancePage = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRecords() {
      setIsLoading(true);
      try {
        const response = await attendanceManagementService.getAttendanceRecords(selectedDate);
        
        const newRecords = response.map((record: any) => ({
          id: record.employeeId,
          employeeName: record.employeeFirstName + ' ' + record.employeeLastName,
          date: record.date,
          status: record.status.toLowerCase(),
          checkInTime: record.checkinTime,
          checkOutTime: record.checkoutTime,
        }))

        setRecords(newRecords);

      } catch (error) {
        console.error('Error fetching attendance records:', error);
        toast({
          title: "Error",
          description: "Failed to fetch attendance records.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecords();
  }, [selectedDate])

  const handleUpdateStatus = async (id: number, status: 'present' | 'absent' | 'late' | 'free') => {

    try {
      const data = await attendanceManagementService.updateAttendanceStatus(id, selectedDate, status);

      const new_record = {
        id: data.employeeId,
        employeeName: data.employeeFirstName + ' ' + data.employeeLastName,
        date: data.date,
        status: data.status.toLowerCase(),
        checkInTime: data.checkinTime,
        checkOutTime: data.checkoutTime,
      }

      const updatedRecords = records.map(record => 
        record.id === id ? new_record : record
      );
      
      setRecords(updatedRecords);
      
      toast({
        title: "Status updated",
        description: `Attendance status has been updated to ${status}.`,
      });
      
    } catch (error) {
      console.error('Error updating attendance status:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance status.",
        variant: "destructive",
      });
    }
  }

  const filteredTodayRecords = records.filter(record => 
    record.date === selectedDate &&
    (record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '')
  );

  const filteredAllRecords = records.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === ''
  );

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
            <p className="text-muted-foreground">Track and manage employee attendance.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <Input
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <Tabs defaultValue="today">
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <AttendanceTable 
              records={filteredTodayRecords}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default AttendancePage;
