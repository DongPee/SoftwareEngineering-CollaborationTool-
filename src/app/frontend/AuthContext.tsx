// src/frontend/AuthContext.tsx
"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { signOut, getSession} from "next-auth/react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  isSocialLogin: string | null;  
  login: (username: string, social: string) => void;
  logout: () => void;
  setIsSocialLogin: (value: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isSocialLogin, setIsSocialLogin] = useState<string | null>(null);

  // 로그인 함수
  const login = (username: string, social: string = "none") => {
    setIsLoggedIn(true);
    setUsername(username);
    setIsSocialLogin(social); // 소셜 로그인 여부 설정
    localStorage.setItem("username", username);
    localStorage.setItem("isSocialLogin", social); 
    console.log(username, social);
  };

  // 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setIsSocialLogin(null); 
    localStorage.removeItem("username");
    localStorage.removeItem("isSocialLogin");
    signOut({ redirect: false });
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUsername(session.user.name || null);
        setIsSocialLogin(localStorage.getItem("isSocialLogin"));
      }
    };
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isSocialLogin, login, logout, setIsSocialLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };