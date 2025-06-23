import { useState, useEffect, useContext} from "react";
import CardModal from "./CardModal";
import { createColumn, deleteColumn, createCard, deleteCards, deleteCard } from "./addDeleteBoardCard";
import { io } from 'socket.io-client';
import { CardContext } from "../cardContext";
import type { CardType, ColumnType, Card, Column} from "../cardContext";
import { AuthContext } from "../AuthContext";
const socket = io('http://43.203.124.34:5001');
import { writeLog } from "../verification";
import LoginPage from "../login/page";
type BoardProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

export default function Board({ projectId }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [addColumnToggle, setColumnToggle] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const cardCon = useContext(CardContext);
  const auth = useContext(AuthContext);
  const email = auth.email || null;
  const fetchColumnsAndCards = async () => {
    if (!projectId) return;
    try {
      const response = await fetch("http://43.203.124.34:5001/api/showColumn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (response.ok) {
        const loadedColumns: Column[] = await Promise.all(
          data.columns.map(async (col: ColumnType) => {
            const cardRes = await fetch("http://43.203.124.34:5001/api/showCard", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ columnId: col.id }),
            });

            const cardData = await cardRes.json();

            const cards = cardRes.ok && cardData.cards
              ? await Promise.all(
                  cardData.cards.map(async (card: CardType) => {
                    return {
                      id: card.id,
                      text: card.title,
                      details: card.description ?? "",
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

  useEffect(() => {
    fetchColumnsAndCards();
  }, [projectId]);

  useEffect(() => {
    socket.on('isChanged', () => {
      cardCon.fetchCardsByProject(projectId);
      fetchColumnsAndCards();
    });
    return () => {
      socket.off('isChanged');
    };
  }, []);

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


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.dataTransfer.setData("cardId", card.id.toString());
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragging");
  };
  
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, column: Column) => {
    const cardId = parseInt(e.dataTransfer.getData("cardId"));
    
    const card = columns.flatMap(col => col.cards).find(c => c.id === cardId);

    if (card) {
      try {
        const response = await fetch("http://43.203.124.34:5001/api/dragCard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardId: card.id,
            columnId: column.id,
          }),
        });
  
        if (!response.ok) {
          throw new Error("카드 옮기기 실패");
        }
      } catch (error) {
        console.error("카드 옮기기 에러", error);
      }
      socket.emit('isChanged');
      writeLog("드래그 앤 드롭", `카드 ${cardId}가 컬럼 '${column.title}'(id: ${column.id})로 이동`, email, projectId);

    }
  };

  if(!auth.email) return <LoginPage />
  return (
    <div className="board">
      {columns.map(column => (
        <div
          key={column.id}
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column)}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{column.title}</h2>
            <button
              onClick={async () => {
                await deleteCards(column.id);
                await deleteColumn(column.id);
                setColumns(prev => prev.filter((col) => col.id !== column.id));
                writeLog("컬럼삭제", `${column.title}컬럼 삭제`, email, projectId.toString());

                socket.emit('isChanged');
              }}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              <p className="ml-2 mr-2">삭제</p>
            </button>
          </div>
          {column.cards && column.cards.map(card => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              onDragEnd={handleDragEnd}
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
                  writeLog("카드삭제", `${card.text}카드삭제`, email, projectId.toString());

                  socket.emit('isChanged');
                }}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ))}
          {!column.addCardToggle ? (
            <div
              className="w-10 h-10 columnAddButton rounded-full border-2 flex items-center justify-center cursor-pointer text-3xl font-bold"
              onClick={() => {
                setColumns(prevColumns =>
                  prevColumns.map(col =>
                    col.id === column.id
                      ? { ...col, addCardToggle: true }
                      : col
                  )
                );
              }}
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
              onClick={() => {
                setColumns(prevColumns =>
                  prevColumns.map(col =>
                    col.id === column.id
                      ? { ...col, addCardToggle: false , newCardText : ""}
                      : col
                  )
                );
              }}
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
                writeLog("카드추가", `${column.newCardText} 카드 추가`, email, projectId.toString());

                socket.emit('isChanged');
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
          className="min-w-10 h-10 columnAddButton rounded-full border-2 flex items-center justify-center cursor-pointer text-3xl font-bold"
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
              onClick={() => {
                setColumnToggle(prev => !prev);
                setNewColumnTitle(""); // 컬럼 이름 입력값 초기화
              }}
            >
              취소
            </button>
            <button
              onClick={async () => {
                if (projectId) {
                  const newCol = await createColumn(newColumnTitle, parseInt(projectId));
                  writeLog("컬럼추가", `${newColumnTitle}컬럼 추가`, email, projectId.toString());
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
                      addCardToggle : false,
                    },
                  ]);
                  socket.emit('isChanged');
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
      
      
      {selectedCard && (
        <CardModal
          card={selectedCard}
          setSelectedCard={setSelectedCard}
          projectId={projectId}
        />
      )}
    </div>
  );
}