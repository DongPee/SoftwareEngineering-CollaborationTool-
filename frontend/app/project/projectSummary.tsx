// app/project/ProjectSummary.tsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CardContext } from "../cardContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Props 타입
export type SummaryProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};


const ProjectSummary: React.FC<SummaryProps> = ({
  projectId,
}) => {
  const cardCon = useContext(CardContext);
  const [counts, setCounts] = useState<{ title: string; count: number }[]>([]);
  const generateColors = (num: number) => {
    return Array.from({ length: num }, (_, i) => `hsl(${(i * 360) / num}, 70%, 60%)`);
  };
  const dynamicColors = generateColors(cardCon.columns.length);

  
  

  const { columns, cards, fetchCardsByProject } = cardCon;

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        await fetchCardsByProject(projectId);
      } catch (e) {
        console.warn("ProjectSummary: 카드 로드 실패", e);
      }
    })();
  }, [projectId]);

  // 카드 카운트 계산 및 그래디언트 업데이트
  useEffect(() => {
    const tmpCounts = columns.map((col) => ({
      title: col.title,
      count: cards.filter((c) => c.columnId === col.id).length,
    }));
    setCounts(tmpCounts);
    const sum = tmpCounts.reduce((acc, cur) => acc + cur.count, 0) || 1;

    let offset = 0;
    tmpCounts.map((item, idx) => {
      const pct = (item.count / sum) * 100;
      const start = offset;
      offset += pct;
      return `${dynamicColors[idx % dynamicColors.length]} ${start}% ${offset}%`;
    });
  }, [columns, cards]);
  if (!cardCon || typeof cardCon.fetchCardsByProject !== "function") {
    return <div>Loading summary…</div>;
  }
  return (
    <div className="summary-b p-6 overflow-y-auto">
      {/* 상단 요약 블록 */}
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {counts.map(({ title, count }) => (
          <div key={title} className="summary-top p-4 text-center rounded-lg">
            <div className="flex">
              <Image className="summaryImages" src="/checkLogo.jpg" alt="check" width={60} height={60} />
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-bold">
                  {count}개 {title}
                </h1>
              </div>
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

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={counts}
                dataKey="count"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name.length > 4 ? name.slice(0, 4) + "…" : name}
              >
                {counts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={dynamicColors[index % dynamicColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>


      </div>
    </div>
  );
};

export default ProjectSummary;