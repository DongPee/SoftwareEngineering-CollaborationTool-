"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("서버에서 배열이 아닌 데이터를 반환했습니다:", data);
          setUsers([]);
        }
      })
      .catch((err) => console.error("데이터 가져오기 실패:", err));
  }, []);

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user: any, index) => <li key={index}>{user.username}</li>) // user.name → user.username
        ) : (
          <li>사용자 데이터가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}