"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Signup.module.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ICode, setICode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // 인증 코드 요청
  const handleRequestVerification = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/request-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("인증 코드가 이메일로 전송되었습니다.");
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch (error) {
      console.error("인증 코드 요청 오류:", error);
      alert("인증 코드 요청 중 문제가 발생했습니다.");
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: ICode }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("인증 성공!");
        setIsVerified(true); // 인증 성공 시 상태 업데이트
      } else {
        alert(`인증 실패: ${data.error}`);
      }
    } catch (error) {
      console.error("인증 오류:", error);
      alert("인증 처리 중 문제가 발생했습니다.");
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault(); // 기본 제출 방지

    if (!isVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("회원가입 성공!");
      } else {
        alert(`회원가입 실패: ${data.error}`);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        <div className="flex justify-center">
          <Image src="/ollert-logo.jpg" alt="Trello" width={120} height={40} />
        </div>
        <h1 className={styles.title}>회원가입</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 사용자 이름 입력 */}
          <div className={styles.inputGroup}>
            <label>사용자 이름</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* 이메일 입력 */}
          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 인증 버튼 */}
          <div className={styles.inputGroup}>
            <button type="button" className={styles.idenButton} onClick={handleRequestVerification}>
              인증코드 보내기
            </button>
          </div>

          {/* 인증 코드 입력 */}
          <div className={styles.inputGroup}>
            <label>인증번호</label>
            <input
              type="text"
              value={ICode}
              onChange={(e) => setICode(e.target.value)}
              required
            />
          </div>

          {/* 인증 확인 버튼 */}
          <div className={styles.inputGroup}>
            <button type="button" className={styles.idenButton} onClick={handleVerifyCode}>
              인증하기
            </button>
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className={styles.inputGroup}>
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* 회원가입 버튼 */}
          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </form>

        <p className={styles.loginText}>
          이미 계정이 있나요?{" "}
          <Link href="login" className={styles.loginLink}>
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}