
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { EmployeeTable, EmployeeSchedulePresenceResponse } from '@/components/employees/EmployeeTable';
import { EmployeeAttendance, EmployeeDetails, EmployeeSchedule } from '@/components/employees/EmployeeDetails';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

import employeeManagementService from '@/services/employeeManagementService';
import scheduleManagementService from '@/services/scheduleManagementService';
import attendanceManagementService from '@/services/attendanceManagementService';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<EmployeeSchedulePresenceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEmployees() {
      setIsLoading(true);
      try {
        const data = await employeeManagementService.getAllEmployeesWithDetails();
        setEmployees(data);
        console.log("DATA:", data)
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  // Function called when a filter is selected in the schedules tab of information dialog
  async function fetchScheduleOfEmployeeAtDate(date: Date, employeeId: number) {
    try {
      const isoDate = date.toISOString(); // Format: YYYY-MM-DD
      const data : EmployeeSchedule = await scheduleManagementService.getScheduleOfEmployee(employeeId, isoDate);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeDetails.id === employeeId
            ? { ...emp, employeeSchedules: data ? [data] : [] }
            : emp
        )
      );
    } catch (error) {
      toast({ title: "Error fetching schedule", description: error.message, variant: "destructive" });
    }
  }

  // Function called when a filter is selected in the attendances tab of information dialog
  async function fetchAttendanceOfEmployeeAtDate(date: Date, employeeId: number) {
    try {
      const isoDate = date.toISOString(); // Format: YYYY-MM-DD
      const data : EmployeeAttendance = await attendanceManagementService.getAttendanceOfEmployee(employeeId, isoDate);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeDetails.id === employeeId
            ? { ...emp, employeeAttendances: data ? [data] : [] }
            : emp
        )
      );
    } catch (error) {
      toast({ title: "Error fetching schedule", description: error.message, variant: "destructive" });
    }
  }

  // HANDELING EMPLOYEE ADDING
  const handleAddEmployee = async (employeeData: Omit<EmployeeDetails, 'id'>) => {
    const newEmployeePayload = {
      employeeFirstName: employeeData.employeeFirstName,
      employeeLastName: employeeData.employeeLastName,
      employeeEmail: employeeData.employeeEmail,
      employeePhone: employeeData.employeePhone,
      employeePositionTitle: employeeData.employeePositionTitle,
    };
  
    try {
      const response = await employeeManagementService.addEmployee(newEmployeePayload);
  
      if (response.success) {
        const newEmployee: EmployeeSchedulePresenceResponse = {
          employeeDetails: {
            id: response.employeeId, 
            employeeUsername: "",
            employeeFirstName: employeeData.employeeFirstName,
            employeeLastName: employeeData.employeeLastName,
            employeeEmail: employeeData.employeeEmail,
            employeePhone: employeeData.employeePhone,
            employeePositionTitle: employeeData.employeePositionTitle,
          },
          employeeSchedules: [], // Provide default or fetched schedules
          employeeAttendances: [], // Provide default or fetched attendances
        };
  
        setEmployees((prev) => [...prev, newEmployee]);
  
        toast({ title: "Success", description: response.message });
      } else {
        toast({ title: "Error", description: response.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // HANDLING EMPLOYEE EDITING
  const handleEditEmployee = async (updatedEmployee: EmployeeDetails) => {
    const updatedEmployeeToSend = {
      employeeFirstName: updatedEmployee.employeeFirstName,
      employeeLastName: updatedEmployee.employeeLastName,
      employeeEmail: updatedEmployee.employeeEmail,
      employeeUsername: updatedEmployee.employeeUsername,
      employeePhone: updatedEmployee.employeePhone,
      employeePositionTitle: updatedEmployee.employeePositionTitle,
    }

    try {
      const response = await employeeManagementService.editEmployee(updatedEmployee.id, updatedEmployeeToSend)
        
      if (response.success) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employeeDetails.id === updatedEmployee.id
              ? { ...emp, employeeDetails: { ...updatedEmployee } }
              : emp
          )
        );
        toast({ title: "Success", description: `Employee '${updatedEmployee.employeeFirstName + " " + updatedEmployee.employeeLastName}' updated successfully.` });
      } else {
        toast({ title: "Error", description: response.message, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // HANDLING EMPLOYEE DELETING
  const handleDeleteEmployee = (id: number) => {
    try {
      employeeManagementService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.employeeDetails.id !== id));
      toast({ title: "Success", description: "Employee deleted successfully." });

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredEmployees = employees.filter(({ employeeDetails }) => {
    const { employeeFirstName, employeeLastName, employeeEmail, employeePhone, employeePositionTitle } = employeeDetails;
    const searchLower = searchTerm.toLowerCase();
    return (
      `${employeeFirstName} ${employeeLastName}`.toLowerCase().includes(searchLower) ||
      employeeEmail.toLowerCase().includes(searchLower) ||
      employeePhone.toLowerCase().includes(searchLower) ||
      employeePositionTitle.toLowerCase().includes(searchLower)
    );
  });
  
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
            <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
            <p className="text-muted-foreground">Manage your employee information here.</p>
          </div>
          <EmployeeForm onSubmit={handleAddEmployee} />
        </div>

        <div className="w-full max-w-sm mb-4">
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onSelectScheduleDate={fetchScheduleOfEmployeeAtDate}
          onSelectAttendanceDate={fetchAttendanceOfEmployeeAtDate}
        />
      </div>
    </SidebarLayout>
  );
};

export default EmployeesPage;
