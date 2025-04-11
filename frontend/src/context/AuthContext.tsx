// src/context/AuthContext.tsx 
// This file creates a context to manage authentication state in a React application.
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);  // Set to false by default
  const [userId, setUserId] = useState<string | null>(null);  // Store user ID

  // Optional: Load userId from localStorage (if you are using it)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch('https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api/auth/user', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Not logged in');
        const id = await res.text();
        setUserId(id);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
  
    fetchUserId();
  }, []);
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
