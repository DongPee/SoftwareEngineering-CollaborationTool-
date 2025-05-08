// src/app/layout.tsx
"use client";

import { AuthContext, AuthProvider } from "./AuthContext";
import Header from "./header"
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

