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
  getEmail: () => string | null;
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
  const getEmail = () => {
    return localStorage.getItem("email") || email; 
  };
  // 로그아웃 함수
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setIsSocialLogin(null); 
    setEmail(null);
    deleteLoginToken(localStorage.getItem("email"));
    localStorage.removeItem("username");
    localStorage.removeItem("isSocialLogin");
    localStorage.removeItem("email");
    localStorage.removeItem("loginToken");
    signOut({ redirect: false });
  };
  const deleteLoginToken = async (em : string | null) => {
    if(!em){
      console.log("이메일이 없음");
      return;
    }
    try {
      const response = await fetch("http://43.203.124.34:5001/api/deleteLoginToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          em:email
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("삭제완료");
      } else {
        alert("로그인 토큰 삭제 실패");
        alert(data.error);
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        console.log("로그인주웅");
        const name = session.user.name || "";
        const email = session.user.email || "";
        const social = localStorage.getItem("isSocialLogin") || "no-social";
        login(name, social, email)
        await fetch("http://43.203.124.34:5001/api/socialLogin", {
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
      }
    };
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isSocialLogin, login, logout, setIsSocialLogin, email, setEmail, getEmail}}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };