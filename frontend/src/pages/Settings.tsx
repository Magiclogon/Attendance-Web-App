import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layouts/SidebarLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PasswordStrengthIndicator } from '@/components/password/PasswordStrengthIndicator';

import managerManagementService from '@/services/managerManagementService';
import authService from '@/services/authService';

interface CompanyInfo {
  entrepriseName: string;
  entrepriseAddress: string;
  entrepriseEmail: string;
  entreprisePhone: string;
  entrepriseSector: string;
  entrepriseWebsite: string;
}

interface UserDetails {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userUsername: string;
  userPhone: string;
}

interface UserPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ManagerSettings {
  absenceThresholdMinutes: number;
  lateThresholdMinutes: number;
}

const isPasswordValid = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const SettingsPage = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();
  const [managerDetails, setManagerDetails] = useState<UserDetails>();
  const [managerSettings, setManagerSettings] = useState<ManagerSettings>();
  const [companyCameraCode, setCompanyCameraCode] = useState<string>("");
  const [managerPassword, setManagerPassword] = useState<UserPassword>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  async function fetchCompanyInfoAndManagerSettings() {
    setIsLoading(true);
    try {
      const data = await managerManagementService.getCompanyAndManagerInfo();
      setCompanyInfo(data.entrepriseInfo);
      setManagerDetails(data.managerDetails);
      setManagerSettings(data.managerSettings);
      setCompanyCameraCode(data.entrepriseCameraCode);
    } catch (error) {
      console.error("Error fetching company info and manager settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch company info and manager settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanyInfoAndManagerSettings();
  }, []);

  // Handle company info change
  const handleSaveCompanyInfo = async () => {
    if (!companyInfo) return;
    try {
      await managerManagementService.updateCompanyInfo(companyInfo);
      toast({
        title: "Success",
        description: "Company information updated successfully.",
      });
    } catch (error) {
      console.error("Error updating company info:", error);
      toast({
        title: "Error",
        description: "Failed to update company information.",
        variant: "destructive",
      });
    }
  };

  // Handle manager settings change
  const handleSaveSettings = async () => {
    if (!managerSettings) return;
    try {
      await managerManagementService.updateManagerSettings(managerSettings);
      toast({
        title: "Success",
        description: "Manager settings updated successfully.",
      });
    } catch (error) {
      console.error("Error updating manager settings:", error);
      toast({
        title: "Error",
        description: "Failed to update manager settings.",
        variant: "destructive",
      });
    }
  }

  // Handle manager details change
  const handleSaveManagerDetails = async () => {
    if (!managerDetails) return;

    const userObject = {
      newUsername: managerDetails.userUsername,
      newPhoneNumber: managerDetails.userPhone,
    }

    try {
      await authService.changeUserDetails(userObject);
      toast({
        title: "Success",
        description: "Manager details updated successfully.",
      });
    }
    catch (error) {
      console.error("Error updating manager details:", error);
      toast({
        title: "Error",
        description: "Failed to update manager details.",
        variant: "destructive",
      });
    }
  }

  // Handle password change
  const handleSaveManagerPassword = async () => {
    if (!managerPassword) return;

    if (managerPassword.newPassword !== managerPassword.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid(managerPassword.newPassword)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 characters long and include lowercase, uppercase, and a number.",
        variant: "destructive",
      });
      return;
    }

    const passwordObject = {
      oldPassword: managerPassword.oldPassword,
      newPassword: managerPassword.newPassword,
    };

    try {
      const feedback = await authService.changePassword(passwordObject);
      toast({
        title: "Success",
        description: "Manager password updated successfully.",
      });
    } catch (error) {
      console.error("Error updating manager password:", error);
      toast({
        title: "Error",
        description: "Failed to update manager password: " + error.message,
        variant: "destructive",
      });
    } finally {
      setManagerPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

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
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your application preferences.
          </p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Company Settings</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Configure your company details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm sm:text-base">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyInfo?.entrepriseName || ""}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entrepriseName: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base">Address</Label>
                  <Input
                    id="address"
                    value={companyInfo?.entrepriseAddress || ""}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entrepriseAddress: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companyInfo?.entrepriseEmail || ""}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entrepriseEmail: e.target.value }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={companyInfo?.entreprisePhone || ""}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entreprisePhone: e.target.value }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full space-y-2">
                    <Label htmlFor="sector" className="text-sm sm:text-base">Sector</Label>
                    <Input
                      id="sector"
                      value={companyInfo?.entrepriseSector || ""}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entrepriseSector: e.target.value }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label htmlFor="website" className="text-sm sm:text-base">Website</Label>
                    <Input
                      id="website"
                      value={companyInfo?.entrepriseWebsite || ""}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev!, entrepriseWebsite: e.target.value }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end px-6 pb-6">
                <Button 
                  onClick={handleSaveCompanyInfo}
                  className="w-full sm:w-auto h-10 sm:h-9"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="variables">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Variables</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Configure variables for your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full space-y-2">
                    <Label htmlFor="late-trigger" className="text-sm sm:text-base">Late Trigger (minutes)</Label>
                    <Input
                      id="late-trigger"
                      type="number"
                      min="0"
                      value={managerSettings?.lateThresholdMinutes || ""}
                      onChange={(e) => setManagerSettings(prev => ({
                        ...prev!,
                        lateThresholdMinutes: parseInt(e.target.value || "0"),
                      }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label htmlFor="absence-trigger" className="text-sm sm:text-base">Absence Trigger (minutes)</Label>
                    <Input
                      id="absence-trigger"
                      type="number"
                      min="0"
                      value={managerSettings?.absenceThresholdMinutes || ""}
                      onChange={(e) => setManagerSettings(prev => ({
                        ...prev!,
                        absenceThresholdMinutes: parseInt(e.target.value || "0"),
                      }))}
                      className="h-10 sm:h-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-code" className="text-sm sm:text-base opacity-50 cursor-not-allowed">
                    Your Camera Code
                  </Label>
                  <Input
                    id="camera-code"
                    value={companyCameraCode || ""}
                    disabled={true}
                    className="h-10 sm:h-9"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end px-6 pb-6">
                <Button 
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto h-10 sm:h-9"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Change your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full space-y-2">
                    <Label htmlFor="first-name" className="text-sm sm:text-base">First Name</Label>
                    <Input
                      id="first-name"
                      value={managerDetails?.userFirstName || ""}
                      onChange={(e) => setManagerDetails(prev => ({
                        ...prev!,
                        managerFirstName: e.target.value,
                      }))}
                      className="h-10 sm:h-9"
                      disabled={true}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label htmlFor="last-name" className="text-sm sm:text-base">Last Name</Label>
                    <Input
                      id="last-name"
                      value={managerDetails?.userLastName || ""}
                      onChange={(e) => setManagerDetails(prev => ({
                        ...prev!,
                        managerLastName: e.target.value,
                      }))}
                      className="h-10 sm:h-9"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm sm:text-base">Username</Label>
                  <Input
                    id="username"
                    value={managerDetails?.userUsername || ""}
                    onChange={(e) => setManagerDetails(prev => ({ ...prev!, userUsername: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
                <div className="space-y-2">
                  
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="email"
                    type='email'
                    value={managerDetails?.userEmail || ""}
                    onChange={(e) => setManagerDetails(prev => ({ ...prev!, managerEmail: e.target.value }))}
                    className="h-10 sm:h-9"
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={managerDetails?.userPhone || ""}
                    onChange={(e) => setManagerDetails(prev => ({ ...prev!, userPhone: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end px-6 pb-6">
                <Button 
                  onClick={handleSaveManagerDetails}
                  className="w-full sm:w-auto h-10 sm:h-9"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Password Settings</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Change your password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="old-password" className="text-sm sm:text-base">Old Password</Label>
                  <Input
                    id="old-password"
                    type='password'
                    value={managerPassword.oldPassword}
                    onChange={(e) => setManagerPassword(prev => ({ ...prev!, oldPassword: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm sm:text-base">New Password</Label>
                  <Input
                    id="new-password"
                    type='password'
                    value={managerPassword.newPassword}
                    onChange={(e) => setManagerPassword(prev => ({ ...prev!, newPassword: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                  <PasswordStrengthIndicator password={managerPassword.newPassword} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm sm:text-base">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type='password'
                    value={managerPassword.confirmPassword}
                    onChange={(e) => setManagerPassword(prev => ({ ...prev!, confirmPassword: e.target.value }))}
                    className="h-10 sm:h-9"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end px-6 pb-6">
                <Button 
                  onClick={handleSaveManagerPassword}
                  className="w-full sm:w-auto h-10 sm:h-9"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default SettingsPage;