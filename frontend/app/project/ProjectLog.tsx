"use client";

import { useEffect, useState } from "react";

// 백엔드에서 반환되는 로그 항목 전체 필드 정의
export type LogEntry = {
  id: number;
  author: number;         // 또는 author: string (백엔드에서 name으로 join 시)
  log_type: string;
  content: string;
  created_at: string;     // 한국 시간으로 +9된 문자열
  project_id: number;
};

// 컴포넌트 props 타입 정의
interface LogProps {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
}

export default function Log({ projectId, projectName, projectDesc }: LogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!projectId) return;

      try {
        const res = await fetch("http://43.203.124.34:5001/api/getLog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId: parseInt(projectId) }),
        });

        if (!res.ok) {
          throw new Error("로그 요청 실패");
        }

        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("로그 조회 에러:", err);
      }
    };

    fetchLogs();
  }, [projectId]);

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-semibold">프로젝트 로그</h1>
        <p className="text-sm text-gray-500">
          {projectName ?? "프로젝트 이름 없음"} - {projectDesc ?? "설명 없음"}
        </p>
        <p className="text-xs text-gray-400">ID: {projectId ?? "없음"}</p>
      </header>

      {/* 로그 목록 */}
      <main className="flex-1 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <p className="text-center">표시할 로그가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="p-3 border rounded transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium ">User#{log.author}</span>
                  <span className="text-xs ">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 ">
                  [{log.log_type}] {log.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">Project ID: {log.project_id}</div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}