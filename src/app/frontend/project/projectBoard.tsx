"use client";
import { useState } from "react";
import CardModal from "./CardModal";

type BoardProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

export type Card = {
  id: number;
  text: string;
  details: string;
  comments: string[];
  assignee?: string;
  startDate?: string;
  endDate?: string;
};

export type Column = {
  id: number;
  title: string;
  cards: Card[];
  newCardText: string;
};

export default function ProjectBoard({ projectId, projectName, projectDesc }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, title: "To Do", cards: [], newCardText: "" },
    { id: 2, title: "In Progress", cards: [], newCardText: "" },
    { id: 3, title: "Done", cards: [], newCardText: "" },
  ]);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const assigneeOptions = ["user1", "user2", "user3", "user4"];

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
          details: "",
          comments: [],
          assignee: "",
          startDate: "",
          endDate: "",
        };
        return { ...col, cards: [...col.cards, newCard], newCardText: "" };
      }
      return col;
    }));
  };

  // 카드 클릭 > 모달 오픈
  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  // 카드 입력값 변경
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>, columnId: number) => {
    const value = e.target.value;
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, newCardText: value } : col
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
      cards: col.cards.map(card => (card.id === updatedCard.id ? updatedCard : card)),
    })));
    setSelectedCard(null);
  };

  const closeModal = () => setSelectedCard(null);

  return (
    <div className="board">
      <h1 className="text-2xl font-bold mb-4">{projectName ?? "프로젝트 보드"}</h1>
      <p className="text-gray-600 mb-8">{projectDesc ?? "프로젝트 설명 없음"}</p>

      <div className="columns flex gap-4">
        {columns.map(column => (
          <div key={column.id} className="column bg-gray-100 p-4 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-2">{column.title}</h2>

            {column.cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="card bg-white p-2 mb-2 rounded cursor-pointer hover:bg-blue-100 transition"
              >
                {card.text}
              </div>
            ))}

            {/* 카드 추가 */}
            <div className="addCard mt-4 flex flex-col gap-2">
              <input
                type="text"
                value={column.newCardText}
                onChange={(e) => handleCardInputChange(e, column.id)}
                placeholder="새 카드 이름"
                className="p-2 rounded border border-gray-300"
              />
              <button
                onClick={() => addCard(column.id)}
                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              >
                카드 추가
              </button>
            </div>
          </div>
        ))}

        {/* 컬럼 추가 */}
        <div className="addColumn flex flex-col gap-2 bg-gray-50 p-4 rounded shadow-md h-fit">
          <input
            type="text"
            value={newColumnTitle}
            onChange={handleColumnInputChange}
            placeholder="새 컬럼 이름"
            className="p-2 rounded border border-gray-300"
          />
          <button
            onClick={addColumn}
            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
          >
            컬럼 추가
          </button>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onSave={handleDetailSave}
          onClose={closeModal}
          assigneeOptions={assigneeOptions}
        />
      )}
    </div>
  );
}
