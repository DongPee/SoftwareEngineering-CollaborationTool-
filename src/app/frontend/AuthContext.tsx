// src/frontend/AuthContext.tsx
"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { signOut, getSession} from "next-auth/react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  email : string | null;
  isSocialLogin: string | null;  
  login: (username: string, social: string, email : string) => void;
  logout: () => void;
  setIsSocialLogin: (value: string) => void;
  setEmail: (email : string) => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isSocialLogin, setIsSocialLogin] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>("");
  const login = (username: string, social: string = "none", email: string = "") => {
    setIsLoggedIn(true);
    setUsername(username);
    setIsSocialLogin(social);
    localStorage.setItem("username", username);
    localStorage.setItem("isSocialLogin", social);
    const finalEmail = email || localStorage.getItem("email") || "";
    setEmail(finalEmail);
    localStorage.setItem("email", finalEmail);
  };

  // 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setIsSocialLogin(null); 
    setEmail(null);
    localStorage.removeItem("username");
    localStorage.removeItem("isSocialLogin");
    localStorage.removeItem("email");
    signOut({ redirect: false });
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const name = session.user.name || "";
        const email = session.user.email || "";
        const social = localStorage.getItem("isSocialLogin") || "no-social";
        alert(`이름 : ${name}, ${email}, ${social}`);
        login(name, social, name);
        setIsLoggedIn(true);
        setUsername(name);
        setEmail(email);
        setIsSocialLogin(localStorage.getItem("isSocialLogin"));
        const response2 = await fetch("http://localhost:5001/api/socialLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email: email,
            social : social,
          }),
        });

        const data = await response2.json();
        console.log("소셜 로그인 응답:", data);
      }
    };
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isSocialLogin, login, logout, setIsSocialLogin, email, setEmail}}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };