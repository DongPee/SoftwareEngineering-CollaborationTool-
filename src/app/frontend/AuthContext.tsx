"use client";
import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

// 초기값 설정
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };