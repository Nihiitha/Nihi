import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'tel' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  maxLength?: number;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  maxLength,
  className = ''
}) => {
  const showError = error && touched;
  const inputId = `form-field-${name}`;

  const baseInputClasses = `
    mt-1 block w-full rounded-md border-gray-300 shadow-sm 
    focus:ring-blue-500 focus:border-blue-500 sm:text-sm
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${showError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {renderInput()}
        
        {showError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaExclamationCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {showError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <FaExclamationCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
};

export default FormField; 