'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 API 연동 예정
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f4f6f8]">
      {/* 로고 영역 */}
      <div className="mb-4">
        <Image src="/ollert-logo.jpg" alt="Logo" width={100} height={30} />
      </div>

      {/* 카드 박스 */}
      <div className="bg-white shadow-lg rounded-md w-full max-w-sm p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">로그인할 수 없습니까?</h2>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm text-left">다음으로 복구 링크 보내기:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
              className="border border-gray-300 p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              복구 링크 보내기
            </button>
          </form>
        ) : (
          <p className="text-green-600 mt-4">📬 이메일로 복구 링크를 보냈습니다!</p>
        )}

        {/* 로그인으로 돌아가기 */}
        <div className="mt-4">
          <Link href="/frontend/login" className="text-blue-600 text-sm hover:underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>

      {/* 푸터 */}
      <div className="text-center text-xs text-gray-400 mt-6">
        <p><strong>OLLERT</strong></p>
        <p>프로젝트 협업툴 플랫폼</p>
        <p className="mt-1">
          <a href="#" className="underline">로그인 도움말</a> ・{" "}
          <a href="#" className="underline">지원팀에 문의</a>
        </p>
      </div>
    </div>
  );
}
