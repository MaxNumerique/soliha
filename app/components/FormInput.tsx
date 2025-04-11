import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  error?: string;
}

export default function FormInput({ 
  label, 
  type = 'text', 
  className = '', 
  error,
  ...props 
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className={`input input-bordered input-sm w-full ${className} ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
