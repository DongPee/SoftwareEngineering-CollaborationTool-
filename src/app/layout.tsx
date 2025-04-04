"use client";

import "./globals.css";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./frontend/AuthContext";
import { ThemeProvider, useTheme } from "./frontend/ThemeContext";
import DarkModeToggle from "./frontend/DarkModeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <html lang="ko">
          <body>
            <Header />
            <main>{children}</main>
          </body>
        </html>
      </AuthProvider>
    </ThemeProvider>
  );
}

function Header() {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme(); // 다크모드 상태 가져오기

  return (
    <header
      className={`border-b-2 border-gray-300 flex justify-between p-3 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Link href="/">
        <button className="text-2xl font-bold">Ollert</button>
      </Link>

      <div className="flex items-center gap-4">
        <DarkModeToggle />
        {auth?.isLoggedIn ? (
          <span className="cursor-pointer" onClick={auth.logout}>
            {auth.username}님 (로그아웃)
          </span>
        ) : (
          <Link href="/frontend/login">
            <button className="login">log in</button>
          </Link>
        )}
      </div>
    </header>
  );
}