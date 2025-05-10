import React from "react";
import { format } from "date-fns";
import { UserIcon, Calendar, ListIcon, InfoIcon, X, CalendarIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

export interface EmployeeSchedule {
  scheduleId: number;
  employeeFirstName: string;
  employeeLastName: string;
  scheduleName: string;
  date: string; // ISO format: 'YYYY-MM-DD'
  checkinTime: string;
  checkoutTime: string;
  breakStartTime: string;
  breakEndTime: string;
  isDayOff: boolean;
}

export interface EmployeeAttendance {
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  checkinTime: string | null;
  checkoutTime: string | null;
  date: string; // ISO format
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'FREE'; // adapt if more statuses exist
}

export interface EmployeeDetails {
  id: number;
  employeeFirstName: string;
  employeeLastName: string;
  employeeUsername: string;
  employeeEmail: string;
  employeePhone: string;
  employeePositionTitle: string;
}

interface EmployeeDetailsDialogProps {
  employee: EmployeeDetails;
  schedules: EmployeeSchedule[];
  attendances: EmployeeAttendance[];
  onSelectScheduleDate?: (date: Date | undefined, employee_id: number) => void
  onSelectAttendanceDate?: (date: Date | undefined, employee_id: number) => void
  buttonText?: string;
}

export function EmployeeDetailsDialog({
  employee,
  schedules,
  attendances,
  onSelectScheduleDate,
  onSelectAttendanceDate,
  buttonText = "View Details",
}: EmployeeDetailsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>(undefined);
  const [attendanceDate, setAttendanceDate] = React.useState<Date | undefined>(undefined);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-500 text-white border-green-600 hover:bg-green-600';
      case 'LATE':
        return 'bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600';
      case 'ABSENT':
        return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
      case 'FREE':
        return 'bg-green-500 text-white border-green-600 hover:bg-green-600';
      default:
        return 'bg-gray-500 text-white border-gray-600 hover:bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleSelectScheduleDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
  
    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));
  
    setScheduleDate(utcDate);
  
    if (onSelectScheduleDate) {
      onSelectScheduleDate(utcDate, employee.id);
    }
  };

  const handleSelectAttendanceDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
  
    const utcDate = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    ));
  
    setAttendanceDate(utcDate);
  
    if (onSelectAttendanceDate) {
      onSelectAttendanceDate(utcDate, employee.id);
    }
  };

  const resetScheduleFilter = () => {
    setScheduleDate(undefined);
  };

  const resetAttendanceFilter = () => {
    setAttendanceDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          aria-label={`View details for ${employee.employeeFirstName} ${employee.employeeLastName}`}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] rounded-lg sm:rounded-2xl px-4 sm:px-8 py-4 sm:py-6 shadow-lg border sm:border-2 w-[95vw] sm:w-full overflow-y-auto" 
        aria-labelledby="employee-details-title"
      >
        <DialogHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Avatar className="h-10 w-10 sm:h-14 sm:w-14 border border-primary/20 sm:border-2">
              <div className="flex h-full w-full items-center justify-center bg-muted text-sm sm:text-lg font-medium uppercase text-muted-foreground">
                  {employee.employeeFirstName.charAt(0)}{employee.employeeLastName.charAt(0)}
              </div>
            </Avatar>
            <div className="max-w-[60vw] sm:max-w-none">
              <DialogTitle id="employee-details-title" className="text-lg sm:text-2xl font-bold truncate">
                {employee.employeeFirstName} {employee.employeeLastName}
              </DialogTitle>
              <p className="text-muted-foreground text-sm sm:text-base truncate">{employee.employeePositionTitle}</p>
            </div>
          </div>
          <DialogClose className="rounded-full hover:bg-muted p-1 sm:p-2" aria-label="Close dialog">
            <X size={16} className="sm:h-5 sm:w-5" />
          </DialogClose>
        </DialogHeader>
        <Separator className="my-3 sm:my-4" />

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3 text-sm sm:text-lg rounded-lg sm:rounded-xl p-0.5 sm:p-1 h-auto">
              <TabsTrigger value="info" className="py-1 sm:py-2 flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md sm:rounded-lg">
                <InfoIcon size={14} className="sm:h-[18px] sm:w-[18px]" /> <span>Info</span>
              </TabsTrigger>
              <TabsTrigger value="schedules" className="py-1 sm:py-2 flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md sm:rounded-lg">
                <Calendar size={14} className="sm:h-[18px] sm:w-[18px]" /> <span>Schedules</span>
              </TabsTrigger>
              <TabsTrigger value="attendances" className="py-1 sm:py-2 flex items-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md sm:rounded-lg">
                <ListIcon size={14} className="sm:h-[18px] sm:w-[18px]" /> <span>Attendances</span>
              </TabsTrigger>
            </TabsList>

            <div className="h-[50vh] sm:h-[400px] overflow-y-auto mt-3 sm:mt-4">
              {/* INFO TAB */}
              <TabsContent value="info" className="border rounded-lg sm:rounded-xl p-3 sm:p-6 max-h-[calc(100vh-12rem)] overflow-auto shadow-sm sm:shadow-md bg-gradient-to-r from-slate-50 to-white">
                <div className="grid grid-cols-1 gap-4 sm:gap-8 text-sm sm:text-base">
                  <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-5 rounded-lg shadow-sm border-l-2 sm:border-l-4 border-l-blue-500">
                    <h3 className="font-bold text-base sm:text-lg text-blue-700 border-b pb-1 sm:pb-2 mb-2 sm:mb-3">Personal Information</h3>
                    <div className="space-y-2 sm:space-y-4">
                      <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] items-center">
                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Full Name:</span>
                        <span className="font-medium truncate">{employee.employeeFirstName} {employee.employeeLastName}</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] items-center">
                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Email:</span>
                        <a href={`mailto:${employee.employeeEmail}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate text-xs sm:text-sm">
                          {employee.employeeEmail}
                        </a>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] items-center">
                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Phone:</span>
                        <a href={`tel:${employee.employeePhone}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-xs sm:text-sm">
                          {employee.employeePhone}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-5 rounded-lg shadow-sm border-l-2 sm:border-l-4 border-l-green-500">
                    <h3 className="font-bold text-base sm:text-lg text-green-700 border-b pb-1 sm:pb-2 mb-2 sm:mb-3">Employment Details</h3>
                    <div className="space-y-2 sm:space-y-4">
                      <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] items-center">
                        <span className="font-semibold text-gray-700 text-xs sm:text-sm">Position:</span>
                        <span className="font-medium truncate">{employee.employeePositionTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SCHEDULES TAB */}
              <TabsContent value="schedules" className="border rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                  <h3 className="font-medium text-muted-foreground text-sm sm:text-base">Work Schedule</h3>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {scheduleDate && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                        <span>Filter: {format(scheduleDate, "EEE")}</span>
                      </Badge>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <FilterIcon size={14} className="sm:h-4 sm:w-4" />
                          <span>Filter</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={scheduleDate}
                          onSelect={handleSelectScheduleDate}
                          initialFocus
                          className="p-2 sm:p-3 pointer-events-auto"
                        />
                        <div className="flex justify-end gap-2 p-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={resetScheduleFilter}
                            className="text-xs h-7"
                          >
                            Clear
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {schedules.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {schedules.map((schedule, index) => (
                      <div 
                        key={index}
                        className="flex flex-col p-2 sm:p-4 border rounded-lg sm:rounded-xl bg-card hover:shadow-sm sm:hover:shadow-md transition-all duration-300"
                      >
                        <span className="text-sm sm:text-lg font-semibold text-primary mb-1 truncate">{schedule.date}</span>
                        <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
                          <Calendar size={12} className="mr-1 sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {schedule.checkinTime} - {schedule.checkoutTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-muted-foreground text-center">
                    <Calendar size={28} className="mb-2 sm:mb-4 opacity-40 sm:h-10 sm:w-10" />
                    {scheduleDate ? (
                      <>
                        <p className="text-sm sm:text-base">No schedules for {format(scheduleDate, "EEE")}.</p>
                        <p className="text-xs sm:text-sm">Try selecting a different day.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm sm:text-base">No schedules available.</p>
                        <p className="text-xs sm:text-sm">Contact HR to set up a schedule.</p>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ATTENDANCE TAB */}
              <TabsContent value="attendances" className="border rounded-lg sm:rounded-xl p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                  <h3 className="font-medium text-muted-foreground text-sm sm:text-base">Attendance Records</h3>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {attendanceDate && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                        <span>Filter: {format(attendanceDate, "MMM dd")}</span>
                      </Badge>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <CalendarIcon size={14} className="sm:h-4 sm:w-4" />
                          <span>Filter</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={attendanceDate}
                          onSelect={handleSelectAttendanceDate}
                          initialFocus
                          className="p-2 sm:p-3 pointer-events-auto"
                        />
                        <div className="flex justify-end gap-2 p-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={resetAttendanceFilter}
                            className="text-xs h-7"
                          >
                            Clear
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {attendances.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {attendances.map((att, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border p-2 sm:p-4 rounded-lg hover:shadow-sm sm:hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 sm:mr-3 text-muted-foreground sm:h-[18px] sm:w-[18px]" />
                          <span className="font-medium text-sm sm:text-base truncate">{formatDate(att.date)}</span>
                        </div>
                        <Badge className={`text-xs sm:text-sm px-3 py-0.5 sm:px-4 sm:py-1 rounded-full border ${getStatusColor(att.status)}`}>
                          {att.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-muted-foreground text-center">
                    <ListIcon size={28} className="mb-2 sm:mb-4 opacity-40 sm:h-10 sm:w-10" />
                    {attendanceDate ? (
                      <>
                        <p className="text-sm sm:text-base">No record for {format(attendanceDate, "MMM dd")}.</p>
                        <p className="text-xs sm:text-sm">Try selecting a different date.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm sm:text-base">No attendance records available.</p>
                        <p className="text-xs sm:text-sm">Records will appear here once logged.</p>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}