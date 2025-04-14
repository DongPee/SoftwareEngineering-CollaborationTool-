'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from "../signup/signup.module.css";
import { requestVerification, verifyCode } from "@/app/backend/verification";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ICode, setICode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 API 연동 예정
  };

  const handleRequestVerification = async () => {
    const result = await requestVerification(email);
    if (result.success) {
      setSubmitted(true);
      alert('인증 코드가 이메일로 전송되었습니다.');
    } else {
      alert(`오류: ${result.error}`);
    }
  };

  const handleVerifyCode = async () => {
    const result = await verifyCode(email, ICode);
    if (result.success) {
      setIsVerified(true);
      alert('인증 성공!');
    } else {
      alert(`인증 실패: ${result.error}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        <div className="flex justify-center">
          <Image src="/ollert-logo.jpg" alt="Trello" width={120} height={40} />
        </div>
        <h1 className={styles.title}>비밀번호 찾기</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
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

          {/* 인증코드 요청/입력 */}
          {!submitted ? (
            <div className={styles.inputGroup}>
              <button type="button" className={styles.idenButton} onClick={handleRequestVerification}>
                인증코드 보내기
              </button>
            </div>
          ) : (
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

              {!isVerified ? (
                <div className={styles.inputGroup}>
                  <button type="button" className={styles.idenButton} onClick={handleVerifyCode}>
                    인증하기
                  </button>
                  <button type="button" className={styles.idenButton} onClick={handleRequestVerification}>
                    인증코드 다시 보내기
                  </button>
                </div>
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

                  <button type="submit" className={styles.submitButton}>
                    비밀번호 변경
                  </button>
                </>
              )}
            </>
          )}
        </form>

        <p className={styles.loginText}>
          로그인으로 돌아가기{" "}
          <Link href="/frontend/login" className={styles.helpLogin}>
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}