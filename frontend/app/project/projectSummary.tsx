// app/project/Summary.tsx
import React from "react";
import Image from "next/image";

// Summary 컴포넌트에 전달되는 props 타입 정의
export type SummaryProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

const Summary: React.FC<SummaryProps> = ({
  projectId,
  projectName,
  projectDesc,
}) => {
  // 임의의 상태 개수 예시 (실제로는 props나 state로 대체)
  const startCount = 3;
  const inProgressCount = 5;
  const doneCount = 2;

  const total = startCount + inProgressCount + doneCount;
  const startPct = (startCount / total) * 100;
  const inProgPct = (inProgressCount / total) * 100;
  // remaining segment
  const donePct = 100 - startPct - inProgPct;

  // conic-gradient로 원형 그래디언트 생성
  const gradient = `conic-gradient(
    #8884d8 0% ${startPct}%,
    #82ca9d ${startPct}% ${startPct + inProgPct}%,
    #ffc658 ${startPct + inProgPct}% 100%
  )`;

  return (
    <div className="summary-b p-6 overflow-y-auto">
      {/* 상단 요약 블록 */}
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image
              className="summaryImages"
              src="/checkLogo.jpg"
              alt="check"
              width={60}
              height={60}
            />
            <h1 className="font-bold">{doneCount}개 완료함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image
              className="summaryImages"
              src="/updateLogo.jpg"
              alt="check"
              width={60}
              height={60}
            />
            <h1 className="font-bold">0개 업데이트함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image
              className="summaryImages"
              src="/madeLogo.jpg"
              alt="check"
              width={60}
              height={60}
            />
            <h1 className="font-bold">0개 만듦</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image
              className="summaryImages"
              src="/deadlineLogo.jpg"
              alt="check"
              width={60}
              height={60}
            />
            <h1 className="font-bold">0개 마감 예정</h1>
          </div>
        </div>
      </div>

      {/* 상태 개요 및 기타 블록 */}
      <div className="h-150 m-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 상태 개요 카드 */}
        <div className="summary-middle p-4 text-center rounded-lg relative">
          {/* 제목 */}
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">상태 개요</h1>
          </div>

          {/* 중앙: 비율 그래디언트 원형 차트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-32 h-32 rounded-full"
              style={{ background: gradient }}
            />
          </div>

          {/* 우측 하단: 상태별 개수 */}
          <div className="absolute bottom-4 right-4 space-y-1 text-right text-lg text-gray-700 dark:text-gray-300 z-10">
            <div>시작: {startCount}개</div>
            <div>진행중: {inProgressCount}개</div>
            <div>완료: {doneCount}개</div>
          </div>
        </div>

        {/* 기타 summary-middle 블록들 */}
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">최근 활동</h1>
          </div>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">업무 유형</h1>
          </div>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">팀 워크로드</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
