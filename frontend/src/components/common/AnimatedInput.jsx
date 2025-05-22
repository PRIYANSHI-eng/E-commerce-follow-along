import React, { useState } from 'react';

const AnimatedInput = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  onFocus,
  onBlur,
  min,
  max,
  pattern,
  rightIcon,
  onRightIconClick
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium transition-all duration-200 ${
            error ? 'text-red-600' : isFocused ? 'text-purple-600' : 'text-gray-700'
          } ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className="relative mt-1">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          min={min}
          max={max}
          pattern={pattern}
          className={`
            block w-full rounded-md shadow-sm transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'}
            ${rightIcon ? 'pr-10' : 'pr-4'}
            py-2.5 text-sm
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            ${isFocused ? 'ring-2 ring-opacity-50' : ''}
          `}
        />
        
        {rightIcon && (
          <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
        
        {/* Animated bottom border effect */}
        <div 
          className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ${
            isFocused ? 'w-full' : 'w-0'
          }`}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-[shake_0.5s_cubic-bezier(0.36,0.07,0.19,0.97)_both]">
          {error}
        </p>
      )}
    </div>
  );
};

export default AnimatedInput;