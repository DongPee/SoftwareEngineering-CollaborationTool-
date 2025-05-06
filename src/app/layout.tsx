// src/app/layout.tsx
"use client";

import { AuthContext, AuthProvider } from "./frontend/AuthContext";
import Header from "./frontend/header"
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="ko">
        <body>
          <Header />
          <main className="projectMain">{children}</main>
        </body>
      </html>
    </AuthProvider>
  );
}

