import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import kioskService from '@/services/kioskService';


const AttendanceCamera = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleCodeSubmission(e) {
    e.preventDefault();
    setIsLoading(true);

    const codeObject = {
      cameraCode: code
    }

    try {
      const response = await kioskService.authenticateKiosk(codeObject);
      toast({
        title: 'Authentication successful!',
        description: 'Camera setup successfully!',
        variant: 'default',
      })
      navigate('/mark-attendance')

    } catch (error) {
      console.error("Error during code submission:", error);
      toast({
        title: 'Error',
        description: 'Failed to setup camera. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Company Code</CardTitle>
          <CardDescription className="text-center">
            Enter the code given to your company to setup the attendance camera.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCodeSubmission} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <div className="relative">
                <Input 
                  id="code" 
                  type="code" 
                  placeholder="Code..." 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Setting up' : 'Setup'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-2 border-t pt-5">
            <p className="text-sm text-muted-foreground">
                It's a 32 characters long code.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};


export default AttendanceCamera;