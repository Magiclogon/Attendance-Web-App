import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import authService from '@/services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userObject = {
        username: username,
        password: password
    };

    try {
        const response = await authService.login(userObject);
        if (response.role === "ROLE_MANAGER") {
            toast({ title: 'Login successful!', description: 'Welcome back!', variant: 'default' });
            navigate('/manager-dashboard');
        }
        else if (response.role === "ROLE_EMPLOYEE") {
            toast({ title: 'Login successful!', description: 'Welcome back!', variant: 'default' });
            console.log(response.hasRegisteredFace);
            if(response.hasRegisteredFace === true) {
                navigate('/employee-dashboard');
            } else {
                navigate('/face-recognition');
            }
        }
    } catch (error) {
        toast({ title: 'Login failed', description: 'Invalid username or password', variant: 'destructive' });
    }
    setIsLoading(false);

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Use your username and password to log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <div className="relative">
                <Input 
                  id="username" 
                  type="username" 
                  placeholder="Username..." 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2 border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;