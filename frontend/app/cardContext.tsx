import React, { createContext, useState } from 'react';

export interface ColumnType {
  id: number;
  title: string;
  position: number;
  created_at: string;
  project_id: number;
}

export type CardModalProps = {
  card: Card;
  setSelectedCard: (selectedCard : Card) => void;
  projectId: string | null;
};

export type Card = {
  id: number;
  text: string;
  details: string;
  assignee?: string;
  startDate?: string;
  endDate?: string;
  columnId: number;
};

export type Column = {
  id: number;
  title: string;
  cards: Card[];
  newCardText: string;
  addCardToggle: boolean;
};

export interface CardType {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  position: number;
  created_at: string;
  column_id: number;
  manager: number | null;
  startDate: string | null;
  endDate: string | null;
  card_desc: string | null;
}

// 🔹 Context 타입
interface CardContextType {
  columns: ColumnType[];
  cards: CardType[];
  loading: boolean;
  fetchCardsByProject: (projectId: string | null) => Promise<void>;
}

// 🔹 초기 context
const CardContext = createContext<CardContextType | null>({
  columns: [],
  cards: [],
  loading: false,
  fetchCardsByProject: async () => {},
});



// 🔹 Provider
export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCardsByProject = async (projectId: string | null) => {
    setLoading(true);
    try {
      // 1. 컬럼 조회
      const columnRes = await fetch('http://43.203.124.34:5001/api/showColumn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      console.log(columnRes);
      if (!columnRes.ok) throw new Error('컬럼 조회 실패');

      const columnData = await columnRes.json();
      const columnList: ColumnType[] = columnData.columns;
      setColumns(columnList);

      // 2. 컬럼별 카드 조회
      const allCards: CardType[] = [];

      for (const column of columnList) {
        const cardRes = await fetch('http://43.203.124.34:5001/api/showCard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId: column.id }),
        });

        if (!cardRes.ok) {
          console.warn(`컬럼 ID ${column.id}의 카드 조회 실패`);
          continue;
        }

        const cardData = await cardRes.json();
        const cardsInColumn: CardType[] = cardData.cards;
        allCards.push(...cardsInColumn);
      }

      setCards(allCards);
    } catch (err) {
      console.error('카드 전체 조회 중 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContext.Provider value={{ columns, cards, loading, fetchCardsByProject}}>
      {children}
    </CardContext.Provider>
  );
};

export {CardContext};