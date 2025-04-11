// src/context/AuthContext.tsx 
// This file creates a context to manage authentication state in a React application.
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React, { createContext, useState } from 'react';


interface AuthContextType {
  userId: string | null;
  isLoggedIn: boolean;
  setUserId: (id: string | null) => void;
  setIsLoggedIn: (status: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoggedIn: false,
  setUserId: () => {},
  setIsLoggedIn: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, setUserId, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
