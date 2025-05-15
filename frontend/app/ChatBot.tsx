import React, { useState, useEffect } from "react";

const POSAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; content: string }[]
  >([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: "user", content: inputText }]);

    try {
      const response = await fetch("http://127.0.0.1:5002/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();

      // GPT 응답은 따로 사용
      const gptResponse = data.gpt_response;

      // SpaCy 분석 결과는 따로 출력
      const prettyResult = data.spacy_result
        .map((item: { token: string; pos: string }) => `${item.token} (${item.pos})`)
        .join(", ");
      console.log(prettyResult);
      if(prettyResult){
        setMessages((prev) => [
        ...prev,
        { sender: "bot", content: `🔍 분석 결과: ${prettyResult}` },
      ]);
      }
      if(gptResponse){
        setMessages((prev) => [
        ...prev,
        { sender: "bot", content: `💬 GPT 응답: ${gptResponse}` },
      ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    }

    setInputText("");
  };

  return (
    <div style={styles.container}>
      <h2>💬 POS Chat Analyzer</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              flexDirection: msg.sender === "user" ? "row-reverse" : "row",
            }}
          >
            {msg.sender === "bot" ? (
              <img src="/robot.png" alt="Robot" style={styles.avatar} />
            ) : (
              <div style={styles.userAvatar}>{username.charAt(0).toUpperCase()}</div>
            )}
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.sender === "user" ? "#dcf8c6" : "#e6e6e6",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputSection}>
        <textarea
          rows={3}
          placeholder="분석할 문장을 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleAnalyze} style={styles.button}>
          전송
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },
  chatBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    height: "60vh",
    overflowY: "auto",
    borderRadius: 10,
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  message: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: "50%",
  },
  userAvatar: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: "50%",
    backgroundColor: "#1976d2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 15px",
    borderRadius: "15px",
    wordWrap: "break-word",
    fontSize: "15px",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  textarea: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    resize: "none",
  },
  button: {
    alignSelf: "flex-end",
    padding: "8px 20px",
    fontSize: 16,
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};

export default POSAnalyzer;