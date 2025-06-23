"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/navigation";
import styles from './ProfilePage.module.css';
import { getDarkMode, setDarkMode } from "../DarkState";
import Image from 'next/image';
import LoginPage from "../login/page";

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const [userFilter, setUserFilter] = useState<string>("");
  const router = useRouter();
  const [darkMode, setDarkModeState] = useState(getDarkMode());

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setDarkModeState(newMode);
  };

  useEffect(() => {
    if (auth?.username) {
      const brightness = (Math.random() * 0.6 + 0.7).toFixed(2);
      const contrast = (Math.random() * 0.6 + 0.7).toFixed(2);
      const invert = Math.random() > 0.5 ? 1 : 0;
      setUserFilter(`brightness(${brightness}) contrast(${contrast}) invert(${invert})`);
    }
  }, [auth?.username]);

  if (!auth?.username || !auth?.email) {
    return <LoginPage />
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <Image
          src="/default-user.png"
          alt="프로필 이미지"
          className={styles.profileImage}
          style={{ filter: userFilter }}
          width={100}
          height={100}
        />
        <h1 className={styles.profileTitle}>{auth.username}</h1>
        <p className={styles.profileEmail}>{auth.email}</p>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${darkMode ? styles.buttonPrimary : styles.buttonSecondary}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? "Day" : "Night"}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => router.push("./projectList")}
          >
            내 프로젝트 보기
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => router.push("./forgotPassword")}
          >
            비밀번호 변경
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => router.back()}
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;