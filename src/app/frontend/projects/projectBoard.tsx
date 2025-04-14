"use client";
import { useState } from "react";
import CardModal from "./CardModal";

export type Card = {
  id: number;
  text: string;
  details: string;
  comments: string[];
};

export type Column = {
  id: number;
  title: string;
  cards: Card[];
  newCardText: string;
};

export default function Board() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, title: "To Do", cards: [{ id: 101, text: "프로젝트 시작하기", details: "상세 설명 없음", comments: [] }], newCardText: "" },
    { id: 2, title: "In Progress", cards: [{ id: 201, text: "Next.js 학습", details: "상세 설명 없음", comments: [] }], newCardText: "" },
    { id: 3, title: "Done", cards: [{ id: 301, text: "기본 레이아웃 제작", details: "상세 설명 없음", comments: [] }], newCardText: "" },
  ]);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  // 예외 처리
  const excludedCardTexts = ["프로젝트 시작하기", "Next.js 학습", "기본 레이아웃 제작"];

  // 컬럼 추가
  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newColumn: Column = {
      id: Date.now(),
      title: newColumnTitle.trim(),
      cards: [],
      newCardText: "",
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
  };

  // 카드 추가
  const addCard = (columnId: number) => {
    setColumns(columns.map(col => {
      if (col.id === columnId && col.newCardText.trim()) {
        const newCard: Card = {
          id: Date.now(),
          text: col.newCardText.trim(),
          details: "상세 설명 없음",
          comments: [],
        };
        return { ...col, cards: [...col.cards, newCard], newCardText: "" };
      }
      return col;
    }));
  };

  // 카드 클릭 > 모달 오픈
  const handleCardClick = (card: Card) => {
    if (excludedCardTexts.includes(card.text)) return;
    setSelectedCard(card);
  };

  // 카드 입력값 변경
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>, columnId: number) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, newCardText: e.target.value } : col
    ));
  };

  // 컬럼 입력값 변경
  const handleColumnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumnTitle(e.target.value);
  };

  // 모달 저장
  const handleDetailSave = (updatedCard: Card) => {
    setColumns(columns.map(col => ({
      ...col,
      cards: col.cards.map(card => card.id === updatedCard.id ? updatedCard : card),
    })));
    setSelectedCard(null);
  };

  const closeModal = () => setSelectedCard(null);

  return (
    <div className="board">
      {columns.map(column => (
        <div key={column.id} className="column">
          <h2>{column.title}</h2>

          {column.cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="card cursor-pointer"
            >
              {card.text}
            </div>
          ))}

          {/* 카드 추가 */}
          <div className="addCard">
            <input
              type="text"
              value={column.newCardText}
              onChange={(e) => handleCardInputChange(e, column.id)}
              placeholder="새로운 카드 이름"
              className="bg-white placeholder:text-gray-500 placeholder:opacity-100"
            />
            <button
              onClick={() => addCard(column.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md min-w-30"
            >
              카드 추가
            </button>
          </div>
        </div>
      ))}

      {/* 컬럼 추가 */}
      <div className="addColumn">
        <input
          type="text"
          value={newColumnTitle}
          onChange={handleColumnInputChange}
          placeholder="새로운 컬럼 이름"
          className="min-w-75 min-h-70 bg-gray-200 placeholder:text-gray-500 placeholder:opacity-100"
        />
        <button
          onClick={addColumn}
          className="px-4 py-2 bg-blue-500 text-white rounded-md min-w-75 min-h-30"
        >
          컬럼 추가
        </button>
      </div>

      {/* 모달 컴포넌트 */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onSave={handleDetailSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
