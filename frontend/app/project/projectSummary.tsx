// app/project/ProjectSummary.tsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CardContext } from "../cardContext";

// Props 타입
export type SummaryProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0"];

const ProjectSummary: React.FC<SummaryProps> = ({
  projectId,
  projectName,
  projectDesc,
}) => {
  // 컨텍스트 안전 호출
  const cardCon = useContext(CardContext);
  const [counts, setCounts] = useState<{ title: string; count: number }[]>([]);
  const [total, setTotal] = useState(1);
  const [gradient, setGradient] = useState<string>(
    "conic-gradient(#ccc 0% 100%)"
  );

  // Provider 미설정 또는 fetch함수 없을 경우 로딩 처리
  if (!cardCon || typeof cardCon.fetchCardsByProject !== "function") {
    return <div>Loading summary…</div>;
  }

  const { columns, cards, fetchCardsByProject } = cardCon;

  // 데이터 로드 및 에러 무시
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        await fetchCardsByProject(projectId);
      } catch (e) {
        console.warn("ProjectSummary: 카드 로드 실패", e);
      }
    })();
  }, [projectId, fetchCardsByProject]);

  // 카드 카운트 계산 및 그래디언트 업데이트
  useEffect(() => {
    const tmpCounts = columns.map((col, idx) => ({
      title: col.title,
      count: cards.filter((c) => c.column_id === col.id).length,
    }));
    setCounts(tmpCounts);
    const sum = tmpCounts.reduce((acc, cur) => acc + cur.count, 0) || 1;
    setTotal(sum);

    // 비율 계산
    let offset = 0;
    const stops = tmpCounts.map((item, idx) => {
      const pct = (item.count / sum) * 100;
      const start = offset;
      offset += pct;
      return `${COLORS[idx % COLORS.length]} ${start}% ${offset}%`;
    });

    setGradient(`conic-gradient(${stops.join(", ")})`);
  }, [columns, cards]);

  return (
    <div className="summary-b p-6 overflow-y-auto">
      {/* 상단 요약 블록 */}
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {counts.map(({ title, count }) => (
          <div key={title} className="summary-top p-4 text-center rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <Image
                src={`/icons/${title}.svg`}
                alt={title}
                width={60}
                height={60}
              />
              <h1 className="font-bold">
                {count}개 {title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* 상태 개요 카드 */}
      <div className="h-150 m-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="summary-middle p-4 text-center rounded-lg relative">
          <div className="flex items-center justify-center mb-2">
            <h2 className="font-bold">상태 개요</h2>
          </div>

          {/* 동적 원형 차트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-32 h-32 rounded-full"
              style={{ background: gradient }}
            />
          </div>

          {/* 우측 하단: 동적 개수 */}
          <div className="absolute bottom-4 right-4 space-y-1 text-right text-lg text-gray-700 dark:text-gray-300 z-10">
            {counts.map(({ title, count }) => (
              <div key={title}>
                {title}: {count}개
              </div>
            ))}
          </div>
        </div>

        {/* 기타 summary-middle 블록들 */}
        <div className="summary-middle p-4 text-center rounded-lg">
          <h2 className="font-bold">최근 활동</h2>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <h2 className="font-bold">업무 유형</h2>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <h2 className="font-bold">팀 워크로드</h2>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
