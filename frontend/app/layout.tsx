// src/app/layout.tsx
"use client";
import ChatBot from "./ChatBot";
import { useState } from "react";
import { AuthProvider } from "./AuthContext";
import Header from "./header";
import "./globals.css";
import { CardProvider } from "./cardContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [chatBotClicked, setChatBotClicked] = useState<boolean>(false);

  const handleChatBotToggle = () => {
    setChatBotClicked((prev) => !prev);
  };

  return (
    <CardProvider>
      <AuthProvider>
        <html lang="ko">
          <body>
            <Header />
            <main className="projectMain">{children}</main>

            {chatBotClicked && (
              <div className="chatbot-container">
                <ChatBot onClose={() => setChatBotClicked(false)} />
              </div>
            )}

            {/* ✅ 오른쪽 하단 동그란 버튼 */}
            <button
              className="chatbot-toggle-button"
              onClick={handleChatBotToggle}
              aria-label="ChatBot 열기" 
            >
              💬
            </button>

          </body>
        </html>
      </AuthProvider>
    </CardProvider>
  );
}