import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Settings, Users, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { config } from '@/utils/config';
import { useToast } from '@/hooks/use-toast';

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
};

const SidebarItem = ({ to, icon, label, active, collapsed }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2 mb-1',
          active
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
          collapsed && 'px-2 py-2'
        )}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

type SidebarLayoutProps = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setMobileMenuOpen(false);
      }
    };
    handleResize(); // Initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const sidebarItems = [
    {
      path: '/manager-dashboard',
      label: 'Dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-layout-dashboard"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    { path: '/employees', label: 'Employees', icon: <Users size={20} /> },
    { path: '/schedules', label: 'Schedules', icon: <Calendar size={20} /> },
    { path: '/attendance', label: 'Attendance', icon: <Clock size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-sidebar transition-all duration-300 flex flex-col fixed md:relative z-40',
          mobileMenuOpen ? 'left-0' : '-left-full md:left-0',
          collapsed ? 'w-16' : 'w-64',
          'h-full'
        )}
      >
        <div className="p-3 sm:p-4">
          <div className={cn('flex items-center h-12', collapsed ? 'justify-center' : 'justify-between')}>
            {!collapsed && (
              <h1 className="text-lg sm:text-xl font-bold text-sidebar-foreground truncate">
                {config.companyName}
              </h1>
            )}
            {mobileMenuOpen && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent/50 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent/50 hidden md:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              )}
            </Button>
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </div>
        <div className="p-3 sm:p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground shrink-0">
                {config.managerName ? config.managerName.charAt(0) : 'M'}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{config.managerName}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{config.managerEmail}</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </Button>
            )}
          </div>
          {collapsed && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </Button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border h-14 flex items-center px-4 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <h1 className="font-semibold truncate">{config.companyName}</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default SidebarLayout;