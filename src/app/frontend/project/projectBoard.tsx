"use client";
import { useState, useEffect} from "react";
import CardModal from "./CardModal";
import { createColumn, deleteColumn, createCard, deleteCards } from "./addDeleteBoardCard";

type BoardProps = {
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
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

export default function Board({ projectName, projectId }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>([
  ]);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const assigneeOptions = ["user0", "user1", "user2", "user3"];
  
  useEffect(() => {
    if (!projectId) return;
  
    const fetchColumnsAndCards = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/showColumn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const loadedColumns: Column[] = await Promise.all(
            data.columns.map(async (col: any) => {
              // 각 컬럼에 대한 카드 불러오기
              const cardRes = await fetch("http://localhost:5001/api/showCard", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ columnId: col.id }),
              });
  
              const cardData = await cardRes.json();
              const cards = cardRes.ok && cardData.cards ? cardData.cards.map((card: any) => ({
                id: card.id,
                text: card.title,
                details: card.description ?? "",
                comments: [],
                columnId: card.column_id, 
              })) : [];
  
              return {
                id: col.id,
                title: col.title,
                cards: cards,  // 카드 추가됨!
                newCardText: "",
              };
            })
          );
  
          setColumns(loadedColumns);
        } else {
          console.error("컬럼 로드 실패:", data.error);
        }
      } catch (err) {
        console.error("컬럼 로드 중 오류:", err);
      }
    };
  
    fetchColumnsAndCards();
  }, [projectId]);

  

  // 카드 클릭 > 모달 오픈
  const handleCardClick = (card: Card) => {
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
  };

  const closeModal = () => setSelectedCard(null);

  return (
    <div className="board">
      {columns.map(column => (
        <div key={column.id} className="column">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{column.title}</h2>
            <button
              onClick={async () => {
                // 1. 카드 먼저 삭제 요청
                await deleteCards(column.id);
                // 2. 컬럼도 삭제 요청
                await deleteColumn(column.id);
                // 3. 프론트 상태에서도 컬럼과 카드 제거
                setColumns(prev =>
                  prev.filter((col) => col.id !== column.id)
                );
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              <p className="ml-2 mr-2">삭제</p>
            </button>
          </div>
          {column.cards && column.cards.map(card => (
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
              onClick={() => {
                createCard(column.newCardText, column.id).then((newCard) => {
                  if (!newCard) return;
                  const cardWithColumnId = {
                    ...newCard,
                    columnId: column.id, // ✅ 여기 추가
                  };
                  setColumns(columns.map(col => 
                    col.id === column.id
                      ? {
                          ...col,
                          cards: [...col.cards, cardWithColumnId],
                          newCardText: "",
                        }
                      : col
                  ));
                });
              }}
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
          onClick={async () => {
            if (projectId) {
              const newCol = await createColumn(newColumnTitle, parseInt(projectId));
              
              if (!newCol) {
                console.error("컬럼 생성 실패");
                return;
              }
              setColumns([
                ...columns,
                {
                  ...newCol,
                  cards: [],
                  newCardText: "",
                },
              ]);
              setNewColumnTitle(""); // 입력창 초기화
            } else {
              console.error("프로젝트 ID가 없습니다.");
            }
          }}
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
          assigneeOptions={assigneeOptions}
        />
      )}
    </div>
  );
}