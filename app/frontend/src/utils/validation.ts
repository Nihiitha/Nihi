export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (value: string, rules: ValidationRule, fieldName: string): string | null => {
  // Required validation
  if (rules.required && !value.trim()) {
    return `${fieldName} is required`;
  }

  // Skip other validations if value is empty and not required
  if (!value.trim()) {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} must be less than ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return `${fieldName} format is invalid`;
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (values: Record<string, string>, rules: Record<string, ValidationRule>): ValidationResult => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const value = values[fieldName] || '';
    const error = validateField(value, fieldRules, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  },
  
  bio: {
    maxLength: 500
  },
  
  title: {
    required: true,
    maxLength: 100
  },
  
  location: {
    required: true,
    maxLength: 100
  },
  
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  
  website: {
    pattern: /^https?:\/\/.+\..+/
  },
  
  company: {
    required: true,
    maxLength: 100
  },
  
  institution: {
    required: true,
    maxLength: 100
  },
  
  degree: {
    required: true,
    maxLength: 100
  },
  
  field: {
    required: true,
    maxLength: 100
  }
};

// Custom validation functions
export const customValidations = {
  passwordStrength: (value: string): string | null => {
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasLower) return 'Password must contain at least one lowercase letter';
    if (!hasUpper) return 'Password must contain at least one uppercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecial) return 'Password must contain at least one special character';
    
    return null;
  },
  
  confirmPassword: (password: string) => (confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  },
  
  dateRange: (startDate: string) => (endDate: string): string | null => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return 'End date must be after start date';
    }
    return null;
  },
  
  gpa: (value: string): string | null => {
    const gpa = parseFloat(value);
    if (isNaN(gpa) || gpa < 0 || gpa > 4) {
      return 'GPA must be between 0 and 4';
    }
    return null;
  }
};

// Real-time validation helpers
export const getFieldError = (
  value: string,
  fieldName: string,
  touched: boolean,
  rules: ValidationRule
): string | null => {
  if (!touched) return null;
  return validateField(value, rules, fieldName);
};

export const isFieldValid = (
  value: string,
  touched: boolean,
  rules: ValidationRule
): boolean => {
  if (!touched) return true;
  return validateField(value, rules, '') === null;
}; 