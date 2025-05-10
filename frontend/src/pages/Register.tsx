import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, User, Building, Briefcase, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import authService from '@/services/authService';
import { PasswordStrengthIndicator } from '@/components/password/PasswordStrengthIndicator';

const isPasswordValid = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companySector: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!isPasswordValid(formData.password)) {
      toast({
        title: "Weak Password",
        description:
          "Password must be at least 8 characters long and include lowercase, uppercase, and a number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Terms not accepted",
        description: "You must accept the terms and conditions to register.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    const userObject = {
      managerFirstName: formData.firstName,
      managerLastName: formData.lastName,
      managerUsername: formData.username,
      managerEmail: formData.email,
      managerPhone: formData.phoneNumber,
      entrepriseName: formData.companyName,
      entrepriseSector: formData.companySector,
      managerPassword: formData.password,
    };

    try {
        const {message, success} = await authService.register(userObject)

        if(success === true) {
            toast({ title: 'Registration successful!', description: 'You can now log in.', variant: 'default' });
            navigate("/login")
        }

        else {
            toast({ title: 'Error happened', description: message, variant: 'destructive' });
            setIsLoading(false);
            return
        }

    } catch (error) {
        console.error("Registration error:", error)
        toast({ title: 'Registration failed', description: 'An error occurred during registration.', variant: 'destructive' });
        setIsLoading(false);
        return
    }
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name and Last Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <div className="relative">
                  <Input 
                    id="firstName" 
                    placeholder="First name" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="relative">
                  <Input 
                    id="lastName" 
                    placeholder="Last name" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <div className="relative">
                <Input 
                  id="username" 
                  placeholder="Username" 
                  value={formData.username} 
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="relative">
                <Input 
                  id="phoneNumber" 
                  type="tel" 
                  placeholder="Phone number" 
                  value={formData.phoneNumber} 
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <div className="relative">
                  <Input 
                    id="companyName" 
                    placeholder="Acme Inc." 
                    value={formData.companyName} 
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              {/* Company Sector */}
              <div className="space-y-2">
                <Label htmlFor="companySector">Company Sector *</Label>
                <div className="relative">
                  <Input 
                    id="companySector" 
                    placeholder="Technology" 
                    value={formData.companySector} 
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="pr-10"
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  className="pr-10"
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  onClick={toggleConfirmPasswordVisibility} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => setAcceptTerms(!!checked)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  terms of service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;