"use client"; // useState 사용을 위해 client component 선언
import { useState } from "react";


type Card = {
  id: number;
  text: string;
  selected: boolean; // 선택 상태 추가
};

type Column = {
  id: number;
  title: string;
  cards: Card[];
  newCardText: string; // 각 컬럼마다 카드 입력 상태를 추가
};

export default function Board() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, title: "To Do", cards: [{ id: 101, text: "프로젝트 시작하기" ,selected: false},], newCardText: "" },
    { id: 2, title: "In Progress", cards: [{ id: 201, text: "Next.js 학습" ,selected: false}], newCardText: "" },
    { id: 3, title: "Done", cards: [{ id: 301, text: "기본 레이아웃 제작",selected: false }], newCardText: "" },
  ]);

  const [newColumnTitle, setNewColumnTitle] = useState(""); // 새로운 컬럼 이름을 저장할 상태

  // 컬럼 추가
  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: columns.length + 1,
      title: title,
      cards: [],
      newCardText: "", // 초기 카드 입력값
    };
    setColumns([...columns, newColumn]);
  };

  // 카드 추가
  const addCard = (text: string, columnId: number) => {
    const newCard: Card = {
      id: Date.now(),
      text: text,
      selected: false,
    };

    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, cards: [...column.cards, newCard], newCardText: "" }; // 카드 추가 후 입력 필드 초기화
      }
      return column;
    });

    setColumns(updatedColumns);
  };

  // 컬럼 입력값 변경
  const handleColumnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumnTitle(e.target.value);
  };

  // 카드 입력값 변경
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>, columnId: number) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, newCardText: e.target.value };
      }
      return column;
    });

    setColumns(updatedColumns);
  };
  const toggleCardSelection = (columnId: number, cardId: number) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedCards = column.cards.map((card) => {
          if (card.id === cardId) {
            console.log("이전상태 : " +card.selected);
            return { ...card, selected: !card.selected }; // 상태 반전
          }
          return card;
        });
        return { ...column, cards: updatedCards };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // 카드 추가 버튼 클릭
  const handleAddCardClick = (columnId: number) => {
    const column = columns.find((col) => col.id === columnId);
    if (column && column.newCardText.trim()) {
      addCard(column.newCardText, columnId);
    }
  };

  return (
    <div className="board">
        {columns.map((column) => (
            <div key={column.id} className="column">
            <h2>{column.title}</h2>
            {column.cards.map((card) => (
                <div
                key={card.id}
                onClick={() => toggleCardSelection(column.id, card.id)}
                className={`card`+`${card.selected ? "-selected" : ""} cursor-pointer`}
                >
                {card.text}
                </div>
            ))}
            {/* 카드 추가 입력 필드 및 버튼 */}
            <div className="addCard">
                <input
                type="text"
                className="bg-white placeholder:text-gray-500 placeholder:opacity-100"
                placeholder="새로운 카드 이름"
                value={column.newCardText} // 해당 컬럼의 카드 입력값 상태 바인딩
                onChange={(e) => handleCardInputChange(e, column.id)}
                />
                <button
                onClick={() => handleAddCardClick(column.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md min-w-30"
                >
                카드 추가
                </button>
            </div>
            </div>
        ))}

        {/* 새로운 컬럼 추가 */}
        <div className="addColumn">
            <input
            type="text"
            className="min-w-75 min-h-70 bg-gray-200 placeholder:text-gray-500 placeholder:opacity-100"
            placeholder="새로운 컬럼 이름"
            value={newColumnTitle}
            onChange={handleColumnInputChange}
            />
            <button
            onClick={() => addColumn(newColumnTitle)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md min-w-75 min-h-30"
            >
            컬럼 추가
            </button>
        </div>
    </div>
  );
}
