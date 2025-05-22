import React, { useState, useEffect } from 'react';

const AnimatedButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  variant = 'primary', // primary, secondary, outline, danger, success
  size = 'md', // sm, md, lg
  fullWidth = false,
  loading = false,
  icon = null,
  iconPosition = 'left', // left, right
  animationEffect = 'ripple' // ripple, pulse, shine, none
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [rippleStyle, setRippleStyle] = useState({});
  const [showRipple, setShowRipple] = useState(false);
  
  // Base classes
  let baseClasses = 'relative overflow-hidden transition-all duration-300 font-medium rounded-lg flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300',
    outline: 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg'
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Animation classes
  const getAnimationClass = () => {
    if (disabled || loading) return '';
    
    switch (animationEffect) {
      case 'pulse':
        return 'hover:animate-pulse';
      case 'shine':
        return 'shine-effect';
      case 'none':
        return '';
      default:
        return ''; // Ripple is handled via JS
    }
  };
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || loading ? disabledClasses : ''}
    ${fullWidthClass}
    ${getAnimationClass()}
    ${className}
    ${isPressed ? 'transform scale-95' : 'transform scale-100'}
  `;
  
  // Handle ripple effect
  const handleRipple = (e) => {
    if (animationEffect !== 'ripple' || disabled || loading) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Calculate ripple position
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    setRippleStyle({
      width: `${size}px`,
      height: `${size}px`,
      top: `${y}px`,
      left: `${x}px`
    });
    
    setShowRipple(true);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setShowRipple(false);
    }, 600);
  };
  
  // Handle mouse events for pressed state
  const handleMouseDown = (e) => {
    if (!disabled && !loading) {
      setIsPressed(true);
      handleRipple(e);
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled && !loading) setIsPressed(false);
  };
  
  // Clean up ripple effect on unmount
  useEffect(() => {
    return () => {
      setShowRipple(false);
    };
  }, []);
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Hover overlay */}
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
      </span>
      
      {/* Ripple effect */}
      {showRipple && animationEffect === 'ripple' && (
        <span 
          className="absolute rounded-full bg-white opacity-25 animate-ripple" 
          style={rippleStyle}
        />
      )}
      
      {/* Shine effect */}
      {animationEffect === 'shine' && !disabled && !loading && (
        <span className="absolute inset-0 overflow-hidden">
          <span className="absolute -inset-[100%] top-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shine" />
        </span>
      )}
      
      {/* Loading spinner */}
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Icon (left position) */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Button text */}
      <span>{children}</span>
      
      {/* Icon (right position) */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default AnimatedButton;