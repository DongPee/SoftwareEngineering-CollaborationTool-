"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/navigation";
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const [userFilter, setUserFilter] = useState<string>("");
  const [projects, setProjects] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (auth?.username) {
      const brightness = (Math.random() * 0.6 + 0.7).toFixed(2);
      const contrast = (Math.random() * 0.6 + 0.7).toFixed(2);
      const invert = Math.random() > 0.5 ? 1 : 0;
      setUserFilter(`brightness(${brightness}) contrast(${contrast}) invert(${invert})`);
      // 참여중인 프로젝트 목록 - API 연결 필요(선택사항, 임의로 입력해놓은 상태)
      setProjects(["할 일 관리 앱", "팀 위키 프로젝트"]);
    }
  }, [auth?.username]);

  if (!auth?.username || !auth?.email) {
    return <div className="p-6 text-center text-gray-600 dark:text-gray-300">로그인이 필요합니다.</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <img
          src="/default-user.png"
          alt="프로필 이미지"
          className={styles.profileImage}
          style={{ filter: userFilter }}
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
        {/* 아직 기능은 없음 */}
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