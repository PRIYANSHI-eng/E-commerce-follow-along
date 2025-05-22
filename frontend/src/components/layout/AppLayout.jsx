import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container min-h-screen flex flex-col">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;