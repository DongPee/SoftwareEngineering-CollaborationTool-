// Chat.js
import React, { useEffect, useState, useRef} from 'react';
import { io } from 'socket.io-client';
import './chat.css';

const socket = io('http://43.203.124.34:5001');
export interface ChatMessage {
  id: number;
  content: string;
  created_at: string; // 혹은 Date, 백엔드에서 문자열로 주면 string이 더 일반적
  sender: string;     // username
}
function Chat({ projectId }: { projectId: string | null }) {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<{ sender: string; text: string, id : number, created_at : string}[]>([]);
  const username = localStorage.getItem('username') || '나';
  const userEmail = localStorage.getItem('email') || '';
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fetchMessage = async () => {
    try {
      const response = await fetch("http://43.203.124.34:5001/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({project_id : projectId}),
      });
  
      if (!response.ok) {
        throw new Error("서버 응답 실패");
      }
  
      const data = await response.json();

      const formattedMessages = data.map((msg: ChatMessage) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender,
        created_at: msg.created_at,
      }));
      console.log("he");
      setReceivedMessages(formattedMessages);
    } catch (error) {
      console.error("채팅 데이터를 불러오는 중 오류 발생:", error);
    }
  };
  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }
    try {
      const response = await fetch("http://43.203.124.34:5001/api/setChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userEmail, content: message, project_id : projectId}),
      });
  
      if (!response.ok) {
        throw new Error("메시지 전송 실패");
      }
  
      const data = await response.json(); // { id, content, created_at, sender }
      const newMessage = {
        id: data.id,
        text: data.content,
        sender: data.sender,
        created_at: data.created_at,
      };
  
      setReceivedMessages((prev) => [...prev, newMessage]);
      socket.emit('message');
      setMessage('');
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
    }
  };
  useEffect(() => {
    socket.on('message', () => {
      fetchMessage();
    });

    socket.on('connect', () => {
      console.log('서버에 연결됨:', socket.id);
    });

    return () => {
      socket.off('message');
      socket.off('connect');
    };
  }, []);
  useEffect(() => {
    fetchMessage();
  }, [userEmail]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);
  return (
    <div className="chat-container">
      <h2 className="chat-title">💬 실시간 채팅</h2>
      <div className="chat-box">
        {receivedMessages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === username ? 'me' : 'other'}`}
          >
            <div className="sender-name">{msg.sender}</div>
            <div className="message-bubble">{msg.text}</div>
            <div className="text-xs">{msg.created_at.slice(0,10) +" "+ msg.created_at.slice(11,19)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default Chat;