"use client";  // 이 줄을 추가하세요!

import { useParams, useRouter } from 'next/navigation';  // useParams 사용
import { useEffect, useState, useContext} from 'react';
import { AuthContext } from "../../AuthContext";
import LoginPage from "../../login/page";
export default function InvitePage() {
  const { token } = useParams();  // useParams로 URL 경로에서 token 값 가져오기
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);  // AuthContext에서 auth 정보 가져오기
  const router = useRouter();
  useEffect(() => {
    // token이나 auth.email이 없으면 진행하지 않음
    if (!token || !auth?.email) {
      setMessage("초대 링크가 유효하지 않습니다.");
      setLoading(false);  // 로딩 완료
      return;
    }

    const joinProject = async () => {
      try {
        const response = await fetch("http://43.203.124.34:5001/api/acceptInvite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email: auth.email })  // auth.email 사용
        });

        const result = await response.json();

        if (response.ok) {
          setMessage(`추가되었습니다. 3초뒤에 메인 페이지로 이동합니다.`);
          setTimeout(() => {
            router.push('/'); 
          }, 3000);
        } else {
          setMessage(result.error);
        }
      } catch (error) {
        console.error("API 호출 실패:", error);
        setMessage("서버 오류가 발생했습니다.");
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    joinProject();
  }, [token, auth, router]);  // token 또는 auth가 변경될 때마다 실행

  return (
    !auth?.isLoggedIn ? (
      <LoginPage />
    ) : (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">프로젝트 초대</h1>
        <p className="text-lg text-gray-600 mb-2">프로젝트에 초대 중입니다...</p>
        {loading && <p className="text-blue-500 font-medium animate-pulse">처리 중...</p>}
        {message && <p className="text-green-600 font-semibold mt-4">{message}</p>}
      </div>
    )
  );
}