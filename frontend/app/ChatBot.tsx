import React, { useState, useEffect, useRef } from "react";
import styles from "./chatBot.module.css"; 
import { useRouter } from "next/navigation"; 
import Image from 'next/image';

const ChatBot: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; content: string }[]
  >([]);
  const [username, setUsername] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter(); 


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", content: inputText }]);

    try {
      const response = await fetch("http://43.203.124.34:5001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

      const data = await response.json();

      const gptResponse = data.gpt_response;
      const url = data.redirect_url;
      if (url) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: `${url}로 이동합니다.` },
        ]);
        router.push(url);
      }
      if (gptResponse) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", content: `💬 응답: ${gptResponse}` },
        ]);
      }
    } catch (err){
      console.log(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    }

    setInputText("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>ChatBot</h3>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ❌
          </button>
        )}
      </div>

      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={styles.message}
            style={{
              flexDirection: msg.sender === "user" ? "row-reverse" : "row",
            }}
          >
            {msg.sender === "bot" ? (
              <Image src="/robot.png" alt="Robot" className={styles.avatar} />
            ) : (
              <div className={styles.userAvatar}>
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className={styles.bubble}
              style={{
                backgroundColor: msg.sender === "user" ? "#dcf8c6" : "#e6e6e6",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.content}
            </div>
            <div ref={chatEndRef} />
          </div>
        ))}
      </div>

      <div className={styles.inputSection}>
        <textarea
          rows={3}
          placeholder="분석할 문장을 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={handleAnalyze} className={styles.button}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatBot;