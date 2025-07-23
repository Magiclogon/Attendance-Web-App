
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'free' | 'not opened';
  checkInTime?: string;
  checkOutTime?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onUpdateStatus: (id: number, status: 'present' | 'absent' | 'late' | 'free') => void;
}

const formatTime = (timeString: string | undefined) => {
  if (!timeString) return '-';
  return timeString.slice(0, 5); // Extracts "HH:MM"
};


export function AttendanceTable({ records, onUpdateStatus }: AttendanceTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">No attendance records found.</TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employeeName}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    record.status === 'present' || record.status === 'free'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : record.status === 'absent'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : record.status === 'late'
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                      : 'bg-gray-200 text-gray-700'
                    )}>
                    {record.status
                      ? record.status.charAt(0).toUpperCase() + record.status.slice(1)
                      : 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {record.checkInTime ? (
                    <Badge variant="secondary">{formatTime(record.checkInTime)}</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {record.checkOutTime ? (
                    <Badge variant="secondary">{formatTime(record.checkOutTime)}</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Update
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1 h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdateStatus(record.id, 'present')}>
                        Mark as Present
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(record.id, 'late')}>
                        Mark as Late
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(record.id, 'absent')}>
                        Mark as Absent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdateStatus(record.id, 'free')}>
                        Mark as Free
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
