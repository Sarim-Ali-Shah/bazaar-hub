import React from 'react';

const Input = ({ label, id, type = 'text', value, onChange, placeholder, required = false, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bazaar-primary focus:border-bazaar-primary sm:text-sm transition duration-150"
      />
    </div>
  );
};

export default Input;