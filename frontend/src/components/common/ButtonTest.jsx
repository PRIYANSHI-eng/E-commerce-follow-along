import React from 'react';

const ButtonTest = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Button Test</h2>
      <button 
        className="btn-primary"
        onClick={handleClick}
      >
        Test Button
      </button>
    </div>
  );
};
// 
export default ButtonTest;