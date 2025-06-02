"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./ProjectRole.module.css";
import { getDarkMode } from "../DarkState";

type User = {
  user_id: string;
  username: string;
  role: "owner" | "manager" | "member" | "viewer";
};

const dummyProjects = [
  { id: "101", name: "협업툴 개발" },
  { id: "102", name: "AI 도우미" },
  { id: "103", name: "웹 리디자인" },
];

const dummyUsersByProject: Record<string, User[]> = {
  "101": [
    { user_id: "1", username: "사용자1", role: "owner" },
    { user_id: "2", username: "사용자2", role: "manager" },
  ],
  "102": [
    { user_id: "3", username: "사용자3", role: "member" },
    { user_id: "4", username: "사용자4", role: "viewer" },
  ],
  "103": [
    { user_id: "5", username: "사용자5", role: "owner" },
    { user_id: "6", username: "사용자6", role: "member" },
  ],
};

const roleLabels: Record<User["role"], string> = {
  owner: "소유자",
  manager: "관리자",
  member: "구성원",
  viewer: "열람자",
};

export default function ProjectRolePage() {
  const params = useParams(); // 임시
  const [selectedProjectId, setSelectedProjectId] = useState(dummyProjects[0].id);
  const [users, setUsers] = useState<User[]>(dummyUsersByProject[selectedProjectId]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setUsers(dummyUsersByProject[projectId]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>프로젝트 역할 관리</h2>
      <p className={styles.subtitle}>
        현재 선택된 프로젝트: {
          dummyProjects.find((p) => p.id === selectedProjectId)?.name
        } (ID: {selectedProjectId})
      </p>

      <select
        className={styles.dropdown}
        value={selectedProjectId}
        onChange={(e) => handleProjectChange(e.target.value)}
      >
        {dummyProjects.map((proj) => (
          <option key={proj.id} value={proj.id}>
            {proj.name}
          </option>
        ))}
      </select>

      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user.user_id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <span className={styles.username}>{user.username}</span>
              <span className={styles.roleLabel}>{roleLabels[user.role]}</span>
            </div>
            <select
              value={user.role}
              onChange={(e) =>
                handleRoleChange(user.user_id, e.target.value as User["role"])
              }
              className={styles.dropdown}
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
