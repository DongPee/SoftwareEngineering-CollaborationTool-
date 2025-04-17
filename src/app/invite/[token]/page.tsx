"use client";  // 이 줄을 추가하세요!

import { useParams } from 'next/navigation';  // useParams 사용
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../frontend/AuthContext";

export default function InvitePage() {
  const { token } = useParams();  // useParams로 URL 경로에서 token 값 가져오기
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);  // AuthContext에서 auth 정보 가져오기

  useEffect(() => {
    // token이나 auth.email이 없으면 진행하지 않음
    if (!token || !auth?.email) {
      setMessage("초대 링크가 유효하지 않습니다.");
      setLoading(false);  // 로딩 완료
      return;
    }

    const joinProject = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/acceptInvite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email: auth.email })  // auth.email 사용
        });

        const result = await response.json();

        if (response.ok) {
          setMessage(`${result.projectId}가 추가되었습니다.`);
        } else {
          setMessage("초대 링크가 유효하지 않거나 만료되었습니다.");
        }
      } catch (error) {
        console.error("API 호출 실패:", error);
        setMessage("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    joinProject();
  }, [token, auth]);  // token 또는 auth가 변경될 때마다 실행

  return (
    <div>
      <p>프로젝트에 초대 중입니다...</p>
      {loading && <p>처리 중...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}