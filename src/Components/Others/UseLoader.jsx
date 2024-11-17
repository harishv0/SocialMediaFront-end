import React, { createContext, useContext, useState } from 'react';

// Create Context
const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom Hook
export const useLoading = () => useContext(LoadingContext);
