import React, { useState, useEffect } from 'react';
import EmployeeSidebarLayout from '@/components/layouts/EmployeeSidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, User, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import dashboardStatsService from '@/services/dashboardStatsService';
import employeeSelfService from '@/services/employeeSelfService';
import { config } from '@/utils/config';

interface Employee {
    id: number,
    employeeFirstName: string,
    employeeLastName: string,
    employeeUsername: string,
    employeeEmail: string,
    employeePhone: string,
    employeePositionTitle: string,
    employeeEntreprise: string,
}

interface Schedule {
    scheduleId: number,
    employeeFirstName: string,
    employeeLastName: string,
    scheduleName: string,
    date: string,
    checkinTime: string,
    checkoutTime: string,
    breakStartTime: string,
    breakEndTime: string,
    isDayOff: boolean,
}

interface Attendance {
    employeeId: number,
    employeeFirstName: string,
    employeeLastName: string,
    date: string,
    checkinTime: string,
    checkoutTime: string,
    status: string,
}


const employeeData = {
  id: 0,
  employeeFirstName: "NA",
  employeeLastName: "NA",
  employeeUsername: "NA",
  employeeEmail: "NA",
  employeePhone: "NA",
  employeePositionTitle: "NA",
  employeeEntreprise: "NA",
};

const EmployeeDashboard = () => {
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<Date | undefined>(undefined);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("attendance");
  const [employee, setEmployee] = useState<Employee>(employeeData);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  async function fetchEmployeeData() {
    setIsLoading(true);
    try {
        const response = await dashboardStatsService.getEmployeeDashboardInformation();
        setEmployee(response.employee);
        setSchedules(response.schedules);
        setAttendances(response.attendances);
        config.employeeName = response.employee.employeeFirstName + ' ' + response.employee.employeeLastName;
        config.employeeEmail = response.employee.employeeEmail;
        config.companyName = response.employee.employeeEntreprise;
    } catch (error) {
        console.error("Error fetching employee data:", error);
        toast({
            title: "Error",
            description: "Failed to fetch employee data.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function fetchEmployeeScheduleAtDate(date: Date) {
    try {
      const isoDate = date.toISOString();
      const data : Schedule = await employeeSelfService.getScheduleOfEmployee(isoDate);
      setSchedules(data ? [data] : []);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error fetching schedule",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function fetchEmployeeAttendanceAtDate(date: Date) {
    try {
      const isoDate = date.toISOString();
      const data : Attendance = await employeeSelfService.getAttendanceOfEmployee(isoDate);
      setAttendances(data ? [data] : []);
    }
    catch (error) {
      console.error("Error fetching attendance:", error);
      toast({
        title: "Error fetching attendance",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchEmployeeData();
  }, [])

  const handleSelectScheduleDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));

    setSelectedScheduleDate(utcDate);
    fetchEmployeeScheduleAtDate(utcDate);
  };

  const handleSelectAttendanceDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));

    setSelectedAttendanceDate(utcDate);
    fetchEmployeeAttendanceAtDate(utcDate);
  };

  // Reset filters
  const resetFilters = () => {
    if (activeTab === "attendance") {
      setSelectedAttendanceDate(undefined);
    } else {
      setSelectedScheduleDate(undefined);
    }
  };

  if (isLoading) {
    return (
      <EmployeeSidebarLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </EmployeeSidebarLayout>
    );
  }

  return (
    <EmployeeSidebarLayout>
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Employee Dashboard</h1>
          <Button variant="outline" asChild size="sm" className="self-start sm:self-auto">
            <a href="/profile-settings">Edit Profile</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Employee Info Card - Full width on mobile, 1/3 on large screens */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-center">{employee.employeeFirstName + ' ' + employee.employeeLastName}</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center">{employee.employeePositionTitle}</p>
              </div>
              
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex flex-wrap justify-between">
                  <dt className="font-medium">Username:</dt>
                  <dd className="truncate max-w-[180px]">{employee.employeeUsername}</dd>
                </div>
                <div className="flex flex-wrap justify-between">
                  <dt className="font-medium">Position:</dt>
                  <dd className="truncate max-w-[180px]">{employee.employeePositionTitle}</dd>
                </div>
                <div className="flex flex-wrap justify-between">
                  <dt className="font-medium">Email:</dt>
                  <dd className="truncate max-w-[180px]">{employee.employeeEmail}</dd>
                </div>
                <div className="flex flex-wrap justify-between">
                  <dt className="font-medium">Phone:</dt>
                  <dd className="truncate max-w-[180px]">{employee.employeePhone}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {/* Records Card - Full width on mobile, 2/3 on large screens */}
          <Card className="lg:col-span-2">
            <Tabs defaultValue="attendance" onValueChange={setActiveTab}>
              <CardHeader className="pb-0 space-y-3">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="mb-1 sm:mb-0">Employee Records</CardTitle>
                    <TabsList className="h-9">
                      <TabsTrigger value="attendance" className="flex items-center gap-1 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Attendance</span>
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="flex items-center gap-1 text-xs sm:text-sm">
                        <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Schedule</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9">
                          <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          {activeTab === "attendance" ? 
                            (selectedAttendanceDate ? format(selectedAttendanceDate, "PPP") : "Select date") : 
                            (selectedScheduleDate ? format(selectedScheduleDate, "PPP") : "Select date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom">
                        <Calendar
                          mode="single"
                          selected={activeTab === "attendance" ? selectedAttendanceDate : selectedScheduleDate}
                          onSelect={activeTab === "attendance" ? handleSelectAttendanceDate : handleSelectScheduleDate}
                          className={cn("p-3 pointer-events-auto")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {((activeTab === "attendance" && selectedAttendanceDate) || 
                     (activeTab === "schedule" && selectedScheduleDate)) && (
                      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs sm:text-sm h-8 sm:h-9">
                        Clear filter
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription>View your attendance and upcoming schedules</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 sm:pt-6">
                <TabsContent value="attendance">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Date</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Check In</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Check Out</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendances.length > 0 ? (
                            attendances.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-2 sm:py-3 sm:px-4">{item.date}</td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4">
                                  <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs whitespace-nowrap">
                                    {item.checkinTime?.slice(0, 5) || "-"}
                                  </Badge>
                                </td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4">
                                  <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs whitespace-nowrap">
                                    {item.checkoutTime?.slice(0, 5) || "-"}
                                  </Badge>
                                </td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4">
                                  <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                    item.status === 'FREE' ? 'bg-green-100 text-green-800' :
                                    item.status === 'LATE' ? 'bg-yellow-100 text-yellow-800' : 
                                    item.status === 'NOT OPENED' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm">
                                No attendance records found for the selected date
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9">
                    View All Attendance Records
                  </Button>
                </TabsContent>
                
                <TabsContent value="schedule">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Date</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Shift</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Working Hours</th>
                            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Break Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.length > 0 ? (
                            schedules.map((item, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-2 sm:py-3 sm:px-4">{item.date}</td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4 max-w-[100px] truncate">{item.scheduleName}</td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4">
                                  <Badge className="text-xs whitespace-nowrap">
                                    {item.checkinTime.slice(0, 5)} – {item.checkoutTime.slice(0, 5)}
                                  </Badge>
                                </td>
                                <td className="py-2 px-2 sm:py-3 sm:px-4">
                                  <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs whitespace-nowrap">
                                    {item.breakStartTime.slice(0, 5)} – {item.breakEndTime.slice(0, 5)}
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 sm:py-6 text-center text-muted-foreground text-xs sm:text-sm">
                                No schedule records found for the selected date
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 sm:mt-4 text-xs sm:text-sm h-8 sm:h-9">
                    View Full Schedule
                  </Button>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </EmployeeSidebarLayout>
  );
};

export default EmployeeDashboard;