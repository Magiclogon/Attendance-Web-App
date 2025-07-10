import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Schedules from "./pages/Schedules";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FaceRecognition from "./pages/FaceRecognition";
import AttendanceCamera from "./pages/AttendanceCamera";
import MarkAttendance from "./pages/MarkAttendance";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manager-dashboard" element={<Dashboard />} />
          <Route path="/face-recognition" element={<FaceRecognition/>} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/camera" element={<AttendanceCamera />} />
          <Route path="mark-attendance" element={<MarkAttendance />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;