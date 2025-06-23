"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./signup.module.css";
import { requestVerification, verifyCode } from "../verification";
import { useRouter } from "next/navigation"; 

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ICode, setICode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter(); 

  // 인증 코드 요청
  const handleRequestVerification = async () => {
    const result = await requestVerification(email, username);
    if (result.success) {
      alert("인증 코드가 이메일로 전송되었습니다.");
      setSubmitted(true);
    } else {
      alert(`오류: ${result.error}`);
    }
  };
  
  // 인증 코드 확인
  const handleVerifyCode = async () => {
    const result = await verifyCode(email, ICode);
    if (result.success) {
      alert("인증 성공!");
      setIsVerified(true);
    } else {
      alert(`인증 실패: ${result.error}`);
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e : React.FormEvent) => {
    e.preventDefault(); 

    if (!isVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://43.203.124.34:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("회원가입 성공!");
        router.push("/")
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

          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!submitted ? (
            <div className={styles.inputGroup}>
              <button type="button" className={styles.idenButton} onClick={handleRequestVerification}>
                인증코드 보내기
              </button>
            </div>
          ) : !isVerified ? (
            <>
              <div className={styles.inputGroup}>
                <label>인증번호</label>
                <input
                  type="text"
                  value={ICode}
                  onChange={(e) => setICode(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <button type="button" className={styles.idenButton} onClick={handleVerifyCode}>
                  인증하기
                </button>
                <button type="button" className={styles.idenButton} onClick={handleRequestVerification}>
                  인증코드 다시 보내기
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.inputGroup}>
                <label>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          

          

          {/* 회원가입 버튼 */}
          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </form>

        <p className={styles.loginText}>
          이미 계정이 있나요?{" "}
          <Link href="login" className={styles.helpLogin}>
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}