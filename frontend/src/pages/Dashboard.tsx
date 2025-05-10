import React from 'react';
import { useState, useEffect } from 'react';

import SidebarLayout from '@/components/layouts/SidebarLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { Users, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import dashboardStatsService from '@/services/dashboardStatsService';
import {config} from '@/utils/config';

const Dashboard = () => {

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [scheduledShifts, setScheduledShifts] = useState(0);
  const [weekPresenceStats, setWeekPresenceStats] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await dashboardStatsService.getDashboardTopStats();
        setTotalEmployees(data.totalEmployees);
        setPresentToday(data.totalAttendances);
        setScheduledShifts(data.totalSchedules);
        setWeekPresenceStats(data.weekPresenceStats);
        config.managerName = data.managerName;
        config.managerEmail = data.managerEmail;
        config.companyName = data.companyName;

      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    }

    fetchStats();
  }, [])

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to your attendance management dashboard.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Employees" 
            value={totalEmployees} 
            icon={<Users size={20} />} 
          />
          <StatCard 
            title="Present Today" 
            value={presentToday}
            icon={<Clock size={20} />} 
          />
          <StatCard 
            title="Scheduled Shifts" 
            value={scheduledShifts}
            icon={<Calendar size={20} />} 
          />
        </div>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <AttendanceChart data={weekPresenceStats}/>
          </div>
          
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
