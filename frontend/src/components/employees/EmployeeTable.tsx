import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeDetailsDialog } from './EmployeeDetails';
import { EmployeeDetails, EmployeeSchedule, EmployeeAttendance } from '@/components/employees/EmployeeDetails';

export interface EmployeeSchedulePresenceResponse {
  employeeDetails: EmployeeDetails;
  employeeSchedules: EmployeeSchedule[];
  employeeAttendances: EmployeeAttendance[];
}

interface EmployeeTableProps {
  employees: EmployeeSchedulePresenceResponse[];
  onEdit: (employee: EmployeeDetails) => void;
  onDelete: (id: number) => void;
  onSelectScheduleDate?: (date: Date | undefined, employee_id: number) => void
  onSelectAttendanceDate?: (date: Date | undefined, employee_id: number) => void
}

export function EmployeeTable({ employees, onEdit, onDelete, onSelectScheduleDate, onSelectAttendanceDate }: EmployeeTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[600px] lg:min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Name</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[150px]">Email</TableHead>
            <TableHead className="hidden md:table-cell min-w-[120px]">Phone</TableHead>
            <TableHead className="min-w-[120px]">Position</TableHead>
            <TableHead className="text-right min-w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">No employees found.</TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.employeeDetails.id}>
                <TableCell>
                  <div className="font-medium">
                    {employee.employeeDetails.employeeFirstName} {employee.employeeDetails.employeeLastName}
                  </div>
                  <div className="text-sm text-muted-foreground sm:hidden">
                    {employee.employeeDetails.employeeEmail}
                  </div>
                  <div className="text-sm text-muted-foreground md:hidden">
                    {employee.employeeDetails.employeePhone}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {employee.employeeDetails.employeeEmail}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {employee.employeeDetails.employeePhone}
                </TableCell>
                <TableCell>
                  {employee.employeeDetails.employeePositionTitle}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <EmployeeDetailsDialog
                      schedules={employee.employeeSchedules}
                      attendances={employee.employeeAttendances}
                      employee={employee.employeeDetails}
                      onSelectScheduleDate={onSelectScheduleDate}
                      onSelectAttendanceDate={onSelectAttendanceDate}
                    />
                    <EmployeeForm
                      onSubmit={(data) => onEdit({ ...employee.employeeDetails, ...data })}
                      defaultValues={employee.employeeDetails}
                      buttonText="Edit"
                      dialogTitle="Edit Employee"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => onDelete(employee.employeeDetails.id)} 
                          className="text-danger-DEFAULT text-sm"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}