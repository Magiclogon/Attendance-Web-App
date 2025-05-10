const getPasswordStrength = (password: string) => {
  return {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
};

export const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const { hasMinLength, hasUpperCase, hasLowerCase, hasNumber } = getPasswordStrength(password);
  
  return (
    <div className="text-xs text-muted-foreground space-y-1 mt-1">
      <div className={`flex items-center ${hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
        {hasMinLength ? '✓' : '•'} At least 8 characters
      </div>
      <div className={`flex items-center ${hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
        {hasUpperCase ? '✓' : '•'} At least one uppercase letter
      </div>
      <div className={`flex items-center ${hasLowerCase ? 'text-green-500' : 'text-gray-500'}`}>
        {hasLowerCase ? '✓' : '•'} At least one lowercase letter
      </div>
      <div className={`flex items-center ${hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
        {hasNumber ? '✓' : '•'} At least one number
      </div>
    </div>
  );
};
