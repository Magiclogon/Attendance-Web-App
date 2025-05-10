import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const employeeSchema = z.object({
  employeeFirstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  employeeLastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  employeeEmail: z.string().email({ message: 'Invalid email address' }),
  employeePhone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  employeePositionTitle: z.string().min(2, { message: 'Position is required' }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormValues) => void;
  defaultValues?: Partial<EmployeeFormValues>;
  buttonText?: string;
  dialogTitle?: string;
}

export function EmployeeForm({
  onSubmit,
  defaultValues = {},
  buttonText = 'Add Employee',
  dialogTitle = 'Add New Employee',
}: EmployeeFormProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeFirstName: '',
      employeeLastName: '',
      employeeEmail: '',
      employeePhone: '',
      employeePositionTitle: '',
      ...defaultValues,
    },
  });

  function handleSubmit(data: EmployeeFormValues) {
    onSubmit(data);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Enter employee's information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2 sm:pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="employeeFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        className="h-10 sm:h-9" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        className="h-10 sm:h-9" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeEmail"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com" 
                        type="email" 
                        className="h-10 sm:h-9" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Phone Number" 
                        className="h-10 sm:h-9" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeePositionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Position</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Position" 
                        className="h-10 sm:h-9" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto h-10 sm:h-9"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto h-10 sm:h-9"
              >
                Save Employee
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}