import Image from "next/image";
import { useState, useContext } from "react";
import type { Card } from "../cardContext";
import CardModal from "./CardModal";
import { CardContext } from '../cardContext';

type BoardProps = {
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
};

const Summary = ({projectId}: BoardProps) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const cardCon = useContext(CardContext);

  const today = new Date();
  const cards = cardCon?.cards || [];

  const completedCount = cards.filter(card => {
    return card.endDate && new Date(card.endDate) < today;
  }).length;

  const createdCount = cards.length;

  const updatedCount = cards.filter(card => {
    const createdAt = new Date(card.startDate);
    const diff = (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const upcomingDueCount = cards.filter(card => {
    if (!card.endDate) return false;
    const dueDate = new Date(card.endDate);
    const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  return (
    <div className="summary-b p-6 overflow-y-auto">
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/checkLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">{completedCount}개 완료함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/updateLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">{updatedCount}개 업데이트함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/madeLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">{createdCount}개 만듦</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/deadlineLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">{upcomingDueCount}개 마감 예정</h1>
          </div>
        </div>
      </div>

      {/* 하단 요약 블록 */}
      <div className="h-150 m-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="summary-middle p-4 text-center rounded-lg">
          <h1 className="font-bold">상태 개요</h1>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <h1 className="font-bold">최근 활동</h1>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <h1 className="font-bold">업무 유형</h1>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <h1 className="font-bold">팀 워크로드</h1>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          setSelectedAction={setSelectedCard}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default Summary;