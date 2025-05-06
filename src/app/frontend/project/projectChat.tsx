// App.js 또는 필요한 컴포넌트에서
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

function Chat() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  useEffect(() => {
    // 메시지 수신
    socket.on('message', (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    // 연결 확인 로그
    socket.on('connect', () => {
      console.log('서버에 연결됨:', socket.id);
    });

    // 클린업
    return () => {
      socket.off('message');
      socket.off('connect');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>실시간 채팅</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default Chat;