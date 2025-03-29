"use client";

import "./globals.css";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./frontend/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="ko">
        <body>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </AuthProvider>
  );
}

function Header() {
  const auth = useContext(AuthContext);

  return (
    <header className="border-b-2 border-gray-300"
      style={{
        padding: "10px",
        background: "#ffffff",
        color: "black",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderBottom: "4"
      }}
    >
      <Link href="/">
        <button
          type="button"
          style={{
            margin: 0,
            fontSize: 30,
            padding: 0,
            color: "black",
          }}
        >
          Ollert
        </button>
      </Link>

      {auth?.isLoggedIn ? (
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: "bold",
            color: "white",
            cursor: "pointer",
          }}
          onClick={auth.logout}
        >
          {auth.username}님 (로그아웃)
        </span>
      ) : (
        <Link href="/frontend/login">
          <button
            className="login"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            log in
          </button>
        </Link>
      )}
    </header>
  );
}