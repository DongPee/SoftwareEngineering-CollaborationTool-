// src/app/layout.tsx
"use client";

import {AuthProvider } from "./AuthContext";
import Header from "./header"
import "./globals.css";
import { CardProvider } from "./cardContext";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CardProvider>
      <AuthProvider>
        <html lang="ko">
          <body>
            <Header />
            <main className="projectMain">{children}</main>
          </body>
        </html>
      </AuthProvider>
    </CardProvider>
  );
}

