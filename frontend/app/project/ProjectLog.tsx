// app/project/Log.tsx
"use client";

import { useEffect, useState } from "react";

// 로그 항목 타입 정의
export type LogEntry = {
  id: number;
  user: string;
  action: string;
  timestamp: string;
};

// Log 컴포넌트에 전달되는 props 타입 전체 정의
interface LogProps {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
}

export default function Log({ projectId, projectName, projectDesc }: LogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // TODO: 실제 fetch 로직 구현
    // 예시: setLogs([{ id:1, user: "Alice", action: "카드 생성", timestamp: new Date().toISOString() }]);
  }, [projectId, projectName, projectDesc]);

  return (
    <div className="flex flex-col h-full">
      {/* 페이지 헤더 */}
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
          <p className="text-center text-gray-500">표시할 로그가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="p-3 border rounded dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{log.user}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 text-gray-700 dark:text-gray-300">
                  {log.action}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
