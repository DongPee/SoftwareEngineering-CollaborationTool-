"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:5001/api/tryLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,       // useState로 관리하는 값
                password,    // useState로 관리하는 값
            }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log("로그인 성공!", data);
            alert("로그인 성공");

        } else {
            console.error("로그인 실패:", data.error);
            alert("로그인 실패");
            alert(data.error); // 에러 메시지 출력
        }
    } catch (err) {
        console.error("서버 오류:", err);
        alert("서버 오류가 발생했습니다.");
    }
};

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-100">
        {/* Trello 로고 */}
        <div className="flex justify-center m">
          <Image src="/ollert-logo.jpg" alt="Trello" width={120} height={40} />
        </div>

        <h2 className="text-lg font-semibold text-center mb-4">계속하려면 로그인하세요.</h2>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="flex flex-col">
          <p className="text-black font-bold">이메일</p>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="border p-2 rounded mb-2 w-full text-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-black font-bold">비밀번호</p>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="border p-2 rounded mb-2 w-full text-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-center text-sm mb-4 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            내 정보 저장
          </label>
          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            계속
          </button>
        </form>

        {/* 소셜 로그인 */}
        <p className="text-center my-4 text-sm text-gray-600">또는 다음을 사용하여 계속하기</p>
        <div className="flex flex-col space-y-2">
          <button className="flex items-center justify-center border p-2 rounded hover:bg-gray-200">
            <Image src="/google-logo.png" alt="Google" width={20} height={20} className="mr-2" />
            Google
          </button>
          <button className="flex items-center justify-center border p-2 rounded hover:bg-gray-200">
            <Image src="/microsoft-icon.png" alt="Microsoft" width={20} height={20} className="mr-2" />
            Microsoft
          </button>
          <button className="flex items-center justify-center border p-2 rounded hover:bg-gray-200">
            <Image src="/apple-icon.png" alt="Apple" width={20} height={20} className="mr-2" />
            Apple
          </button>
        </div>

        {/* 하단 링크 */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <a href="#" className="text-blue-600 hover:underline">로그인할 수 없습니까?</a> ・{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            계정 만들기
          </Link>
        </div>

        {/* 푸터 */}
        <div className="text-xs text-gray-400 text-center mt-6">
          <p><strong>ASDFASDF</strong></p>
          <p>ASDF</p>
          <p>
            <a href="#" className="underline">개인정보 보호정책</a> ・ <a href="#" className="underline">사용자 약관</a>
          </p>
        </div>
      </div>
    </div>
  );
}