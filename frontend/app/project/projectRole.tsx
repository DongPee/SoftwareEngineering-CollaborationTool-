"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type User = {
  user_id: string;
  username: string;
  role: "owner" | "manager" | "member" | "viewer";
};

export default function ProjectRolePage() {
  const params = useParams();
  const projectId = params?.["params"]?.[0];
  const projectName = params?.["params"]?.[1];

  const [users, setUsers] = useState<User[]>([
    { user_id: "1", username: "Alice", role: "owner" },
    { user_id: "2", username: "Bob", role: "manager" },
    { user_id: "3", username: "Charlie", role: "member" },
    { user_id: "4", username: "Dave", role: "viewer" },
  ]);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  useEffect(() => {
    import("../DarkState").then((mod) => {
      document.body.classList.toggle("dark-mode", mod.getDarkMode());
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">프로젝트 역할 관리</h2>
      <p className="text-gray-500 mb-4">
        프로젝트: {projectName} (ID: {projectId})
      </p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">이름</th>
            <th className="p-2">역할</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-b">
              <td className="p-2">{user.username}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.user_id, e.target.value as User["role"])
                  }
                  className="border p-1 rounded"
                >
                  {["owner", "manager", "member", "viewer"].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}