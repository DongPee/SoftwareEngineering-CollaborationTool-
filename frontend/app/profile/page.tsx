"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/navigation";
import styles from './ProfilePage.module.css';
import { getDarkMode, setDarkMode } from "../DarkState";
import Image from 'next/image';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const [userFilter, setUserFilter] = useState<string>("");
  const [projects, setProjects] = useState<string[]>([]);
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
      setProjects(["할 일 관리 앱", "팀 위키 프로젝트"]);
    }
  }, [auth?.username]);

  if (!auth?.username || !auth?.email) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">로그인이 필요합니다.</div>;
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

        <div className={styles.projectList}>
          <h2 className={styles.projectListTitle}>참여 중인 프로젝트</h2>
          <ul className={styles.projectListItems}>
            {projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${darkMode ? styles.buttonPrimary : styles.buttonSecondary}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? "Day" : "Night"}
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => router.push("/frontend")}
          >
            내 프로젝트 보기
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => router.push("/change-password")}
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
