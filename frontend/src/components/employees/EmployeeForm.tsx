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
  companyName?: string;
}

export function EmployeeForm({
  onSubmit,
  defaultValues = {},
  buttonText = 'Add Employee',
  dialogTitle = 'Add New Employee',
  companyName = 'company',
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

            {/* Account Creation Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Account Creation Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      The user created will have an account with:
                    </p>
                    <ul className="mt-1 ml-4 list-disc space-y-1">
                      <li>
                        <strong>Username:</strong> Last Name + First Name + @ + Company Name
                        <br />
                        <span className="text-xs text-blue-600 italic ml-2">Example: SmithJohn@TechCorp</span>
                      </li>
                      <li>
                        <strong>Password:</strong> Last Name + First Name (Lower case)
                        <br />
                        <span className="text-xs text-blue-600 italic ml-2">Example: smithjohn</span>
                      </li>
                      <p className="mt-2 text-sm text-blue-700">
                        In the example above the first name is "John", last name is "Smith", and the company name is "TechCorp".
                      </p>
                    </ul>
                  </div>
                </div>
              </div>
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