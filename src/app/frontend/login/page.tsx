"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react"; 
import { AuthContext } from "../AuthContext";
import styles from "../signup/signup.module.css";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter(); 
  useEffect(() => {
    if (auth?.isLoggedIn) {
      router.push("/");
    }
  }, [auth?.isLoggedIn]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/tryLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        auth?.login(data.username, "none", data.email);
      } else {
        alert("로그인 실패");
        alert(data.error);
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // handleGoogleLogin 함수에서 signIn 후 사용자 정보를 가져오기 위해 session을 사용
const handleGoogleLogin = async () => {
  const response = await signIn("google", { redirect: false });
  if (response?.error) {
    console.error("로그인 오류:", response.error);
  } else{
    auth?.login("", "goggle", "");
  }
};
const handleKakaoLogin = async () => {
  const response = await signIn("kakao", { redirect: false });

  if (response?.error) {
    console.error("카카오 로그인 오류:", response.error);
  }else{
    auth?.login("", "kakao", "");
  }
};
  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
      {/* Trello 로고 */}
        <div className="flex justify-center">
          <Image src="/ollert-logo.jpg" alt="Trello" width={120} height={40} />
        </div>

        <h2 className={styles.title}>계속하려면 로그인하세요.</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          
          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input
            type="email"
            placeholder="이메일을 입력하세요"
            className="border p-2 rounded mb-2 w-full text-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
            {email.includes("@")?(
              <div>
                <label>비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="border p-2 rounded mb-2 w-full text-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              
            ):(
              <div/>
            )}
            
          
          </div>

          <label className="flex items-center text-sm mb-4 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            내 정보 저장
          </label>
          <button type="submit" className={styles.submitButton}>
            계속
          </button>
        </form>

        {/* 소셜 로그인 */}
        <p className={styles.socialLogin}>또는 다음을 사용하여 계속하기</p>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center border p-2 rounded hover:bg-gray-200"
          >
            <Image src="/google-logo.png" alt="Google" width={20} height={20} className="ml-4 mr-4" />
            Google
          </button>
          <button
            onClick={handleKakaoLogin}
            className="flex items-center justify-center border p-2 rounded hover:bg-gray-200"
          >
            <Image src="/kakao-icon.png" alt="Kakao" width={40} height={20} className="mr-2" />
            Kakao
          </button>
        </div>

        <div className="text-center text-sm mt-4">
          <Link href="forgotpassword" className={styles.helpLogin}>
            로그인할 수 없습니까?
          </Link> ・{" "}
          <Link href="signup" className={styles.createAccount}>
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