"use client";
import { useState, useEffect, use} from "react";
import CardModal from "./CardModal";
import { createColumn, deleteColumn, createCard, deleteCards, deleteCard} from "./addDeleteBoardCard";
import users from "./projectTop";

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
  commentsId : number[];
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
  const [columns, setColumns] = useState<Column[]>([]);
  const [addColumnToggle, setColumnToggle] = useState(false);
  const [addCardToggle, setCardToggle] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null); 
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
              const cardRes = await fetch("http://localhost:5001/api/showCard", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ columnId: col.id }),
              });
          
              const cardData = await cardRes.json();
          
              const cards = cardRes.ok && cardData.cards
                ? await Promise.all(
                    cardData.cards.map(async (card: any) => {
                      const commentRes = await fetch("http://localhost:5001/api/showComment", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ cardId: card.id }),
                      });

                      const commentData = await commentRes.json();

                      const commentsId = commentRes.ok && commentData.comments
                        ? commentData.comments.map((comment: any) => Number(comment.id))
                        : [];

                      const comments = commentRes.ok && commentData.comments
                        ? commentData.comments.map((comment: any) => comment.content)
                        : [];

                      return {
                        id: card.id,
                        text: card.title,
                        details: card.description ?? "",
                        commentsId: commentsId, 
                        comments: comments,      
                        columnId: card.column_id,
                      };
                    })
                  )
                : [];
          
              return {
                id: col.id,
                title: col.title,
                cards: cards,
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
                await deleteCards(column.id);
                await deleteColumn(column.id);
                setColumns(prev =>
                  prev.filter((col) => col.id !== column.id)
                );
              }}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              <p className="ml-2 mr-2">삭제</p>
            </button>
          </div>
          {column.cards && column.cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="card cursor-pointer justify-between flex flex-row"
            >
              <h2>{card.text}</h2>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await deleteCard(column.id, card.id);
                  setColumns(prev =>
                    prev.map(col => {
                      if (col.id === column.id) {
                        return {
                          ...col,
                          cards: col.cards.filter(c => c.id !== card.id),
                        };
                      }
                      return col;
                    })
                  );
                }}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ))}
          {/* 카드 추가 */}
          {!addCardToggle ? (
            <div
              className="w-10 h-10 columnAddButton rounded-full border-2 flex items-center justify-center cursor-pointer text-3xl font-bold"
              onClick={() => setCardToggle(prev => !prev)}
            >
              +
            </div>
          ) : (
            <div className="addCard">
            <input
              type="text"
              value={column.newCardText}
              onChange={(e) => handleCardInputChange(e, column.id)}
              placeholder="새로운 카드 이름"
              className="w-3/5 bg-white placeholder:text-gray-500 placeholder:opacity-100"
            />
            <button
              className="w-1/5 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setCardToggle(prev => !prev)}
            >
              취소
            </button>
            <button
              onClick={() => {
                createCard(column.newCardText, column.id).then((newCard) => {
                  if (!newCard) return;
                  const cardWithColumnId = {
                    ...newCard,
                    columnId: column.id,
                    commentsId : [],
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md w-1/5"
            >
              추가
            </button>
          </div>
          )}
          
        </div>
      ))}
      {!addColumnToggle ? (
        <div
          className="w-10 h-10 columnAddButton rounded-full border-2 flex items-center justify-center cursor-pointer text-3xl font-bold"
          onClick={() => setColumnToggle(prev => !prev)}
        >
          +
        </div>
      ) : (
        <div className="addColumn min-h-40 flex flex-col gap-2">
          <input
            type="text"
            value={newColumnTitle}
            onChange={handleColumnInputChange}
            placeholder="새로운 컬럼 이름"
            className="border-2 rounded-lg min-h-20 placeholder:text-gray-500 placeholder:opacity-100"
          />
          <div className="flex-row">
            <button
              className="w-1/2 px-4 py-2 bg-red-500 text-white rounded-full"
              onClick={() => setColumnToggle(prev => !prev)}
            >
              취소
            </button>
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
              className="w-1/2 px-4 py-2 bg-blue-500 text-white rounded-full"
            >
              컬럼 추가
            </button>
          </div>
          
        </div>
      )}
      
      

      {/* 모달 컴포넌트 */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onSave={handleDetailSave}
          onClose={closeModal}
          projectId={projectId}
        />
      )}
    </div>
  );
}