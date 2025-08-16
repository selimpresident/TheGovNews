import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (name: string, email: string, pass: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: In a real application, NEVER store passwords, even hashed ones, in localStorage.
// This is a client-side simulation. A proper implementation requires a secure backend
// and database. The "hashing" here is just base64 encoding for demonstration.
const FAKE_DB_USERS = 'thegovnews_users';
const FAKE_SESSION_TOKEN = 'thegovnews_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for an existing session on initial load
    try {
      const token = localStorage.getItem(FAKE_SESSION_TOKEN);
      if (token) {
        const decodedUser = JSON.parse(atob(token));
        setCurrentUser({ name: decodedUser.name, email: decodedUser.email });
      }
    } catch (error) {
      console.error("Failed to parse session token:", error);
      localStorage.removeItem(FAKE_SESSION_TOKEN);
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(FAKE_DB_USERS) || '[]');
        if (users.some((u: any) => u.email === email)) {
          return reject(new Error('User with this email already exists.'));
        }
        // IMPORTANT: This is NOT secure hashing. Use bcrypt on a server in a real app.
        const hashedPassword = btoa(pass); 
        const newUser = { name, email, password: hashedPassword };
        users.push(newUser);
        localStorage.setItem(FAKE_DB_USERS, JSON.stringify(users));
        resolve();
      }, 500);
    });
  };

  const login = async (email: string, pass: string): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem(FAKE_DB_USERS) || '[]');
            const user = users.find((u: any) => u.email === email);
            const hashedPassword = btoa(pass);

            if (user && user.password === hashedPassword) {
                const userPayload = { name: user.name, email: user.email };
                const fakeToken = btoa(JSON.stringify(userPayload));
                localStorage.setItem(FAKE_SESSION_TOKEN, fakeToken);
                setCurrentUser(userPayload);
                resolve();
            } else {
                reject(new Error('Invalid email or password.'));
            }
        }, 500);
     });
  };

  const logout = () => {
    localStorage.removeItem(FAKE_SESSION_TOKEN);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
