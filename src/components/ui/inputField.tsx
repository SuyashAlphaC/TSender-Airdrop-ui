"use client"; // This directive is important for client-side functionality in Next.js

import React from 'react';

// Define the props interface for the InputField component
interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  large?: boolean; // Optional prop to determine if it's a textarea (multi-row)
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({ label, placeholder, value, large = false, onChange }: InputFieldProps) {
  return (
    <div className="mb-4 w-full"> {/* Container for label and input, full width */}
      <label htmlFor={label.toLowerCase().replace(/\s/g, '-')} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      {large ? (
        // Render a textarea if 'large' prop is true
        <textarea
          id={label.toLowerCase().replace(/\s/g, '-')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={4} // Default rows for a large input
          className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out resize-y"
          // Responsive styling for textarea
          // md:text-base for medium screens, etc.
        />
      ) : (
        // Render a single-line input by default
        <input
          type="text" // Default type for input
          id={label.toLowerCase().replace(/\s/g, '-')}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          // Responsive styling for input
          // md:text-base for medium screens, etc.
        />
      )}
    </div>
  );
}
