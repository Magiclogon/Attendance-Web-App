import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Key, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordStrengthIndicator } from '@/components/password/PasswordStrengthIndicator';

import authService from '@/services/authService';
import employeeSelfService from '@/services/employeeSelfService';

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

const isPasswordValid = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};


const ProfileSettings = () => {
  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    userUsername: "",
    userPhone: "",
  });

  const [userPassword, setUserPassword] = useState<UserPassword>({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  async function fetchUserDetails() {
    setIsLoading(true);
    try {
      const response = await employeeSelfService.getEmployeeInfo();
      const userObject = {
        userId: response.employeeId,
        userFirstName: response.employeeFirstName,
        userLastName: response.employeeLastName,
        userEmail: response.employeeEmail,
        userUsername: response.employeeUsername,
        userPhone: response.employeePhone,
      }

      setUserDetails(userObject);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleSaveUserDetails = async (e) => {
      e.preventDefault();
      if (!userDetails) return;
  
      const userObject = {
        newUsername: userDetails.userUsername,
        newPhoneNumber: userDetails.userPhone,
      }
      setIsSubmitting(true);
      try {
        await authService.changeUserDetails(userObject);
        toast({
          title: "Success",
          description: "User details updated successfully.",
        });
      }
      catch (error) {
        console.error("Error updating User details:", error);
        toast({
          title: "Error",
          description: "Failed to update user details.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  
  const handleSaveUserPassword = async (e) => {
    e.preventDefault();
    if (!userPassword) return;

    if (userPassword.newPassword !== userPassword.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid(userPassword.newPassword)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 characters long and include lowercase, uppercase, and a number.",
        variant: "destructive",
      });
      return;
    }

    const passwordObject = {
      oldPassword: userPassword.oldPassword,
      newPassword: userPassword.newPassword,
    };
    setIsSubmitting(true);
    try {
      const feedback = await authService.changePassword(passwordObject);
      toast({
        title: "Success",
        description: "User password updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user password:", error);
      toast({
        title: "Error",
        description: "Failed to update user password: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUserPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button variant="outline" asChild className="mt-4 md:mt-0">
          <Link to="/employee-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Make changes to your account information here.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveUserDetails}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userDetails.userUsername}
                      onChange={(e) => setUserDetails(prev => ({ ...prev!, userUsername: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userDetails.userEmail}
                      onChange={(e) => setUserDetails(prev => ({ ...prev!, userEmail: e.target.value }))}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Email address cannot be changed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={userDetails.userPhone}
                      onChange={(e) => setUserDetails(prev => ({ ...prev!, userPhone: e.target.value }))}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password here. After saving, you'll need to use the new password to log in.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveUserPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={userPassword.oldPassword}
                        onChange={(e) => setUserPassword(prev => ({ ...prev!, oldPassword: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={userPassword.newPassword}
                        onChange={(e) => setUserPassword(prev => ({ ...prev!, newPassword: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={userPassword.newPassword} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={userPassword.confirmPassword}
                        onChange={(e) => setUserPassword(prev => ({ ...prev!, confirmPassword: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-muted-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;