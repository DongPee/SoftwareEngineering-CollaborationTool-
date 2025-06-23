"use client";
import { useEffect, useState, useContext } from "react";
import styles from "./ProjectRole.module.css";
import { getDarkMode } from "../DarkState";
import { showUsersRole } from "./addDeleteBoardCard";
import { writeLog } from "../verification";
import { AuthContext } from "../AuthContext";
import LoginPage from "../login/page";
type User = {
  user_id: number;
  username: string;
  role: "owner" | "member";
};

const roleLabels: Record<User["role"], string> = {
  owner: "소유자",
  member: "구성원",
};
type BoardProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};
export default function ProjectRolePage({projectId, } : BoardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const [users, setUsers] = useState<User[]>([]);
  const auth = useContext(AuthContext);
  const email = auth?.email || null;
  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);

  const handleRoleChange = async (userId: number, newRole: User["role"]) => {
    if(!projectId) return;
    try {
        const response = await fetch("http://43.203.124.34:5001/api/changeRole", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({projectId, user_id : userId, role : newRole}),
        });
    
        if (!response.ok) {
            throw new Error("서버 응답 실패");
        }
        writeLog("컬럼추가", `사용자 id(${userId}) 권한을 ${newRole}로 변경함`, email, projectId.toString());

    } catch (error) {
        console.error("채팅 데이터를 불러오는 중 오류 발생:", error);
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, role: newRole } : user
      )
    );
  };
  const fetchUsernames = async () => {
    const options = await showUsersRole(projectId);
    const userList = options.map((user: { username: string; id: number;  role:"owner" | "member"}) => ({
      user_id: user.id,
      username: user.username,
      role : user.role,
    }));
    console.log(userList);

    setUsers(userList);
  };
    useEffect(() => {
        if (!projectId) return;
        setSelectedProjectId(projectId);
        fetchUsernames();
    }, [projectId]);
  if(!auth.email) return <LoginPage />
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>프로젝트 역할 관리</h2>
      <p className={styles.subtitle}>
        프로젝트:(ID: {selectedProjectId})
      </p>


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