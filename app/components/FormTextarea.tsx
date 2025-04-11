import React, { TextareaHTMLAttributes } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
  error?: string;
}

export default function FormTextarea({ 
  label, 
  className = '', 
  error,
  ...props 
}: FormTextareaProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        className={`textarea textarea-bordered min-h-[150px] w-full ${className} ${error ? 'textarea-error' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
