import React, { createContext, useState } from 'react';

export interface ColumnType {
  id: number;
  title: string;
  position: number;
  created_at: string;
  project_id: number;
}

export type Card = {
  id: number;
  text: string;
  details: string;
  assignee?: string;
  startDate?: string;
  endDate?: string;
  columnId: number;
};

export type CardModalProps = {
  card: Card;
  setSelectedCard: (setSelectedCard: Card) => void;
  projectId: string | null;
};

export type Column = {
  id: number;
  title: string;
  cards: Card[];
  newCardText: string;
  addCardToggle: boolean;
};

export type comment = {
  text: string,
  author: string,
  author_email : string,
  id : number,
  file_Url : string
}
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

interface CardContextType {
  columns: ColumnType[];
  cards: Card[];
  loading: boolean;
  fetchCardsByProject: (projectId: string | null) => Promise<void>;
  setCards: (cards: Card[]) => void;
  setProjectId: (projectId: string | null) => void;
  projectId: string | null;
}

const CardContext = createContext<CardContextType | null>(null);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCardsByProject = async (projectId: string | null) => {
    setLoading(true);
    try {
      const columnRes = await fetch('http://43.203.124.34:5001/api/showColumn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (!columnRes.ok) throw new Error('컬럼 조회 실패');
      const columnData = await columnRes.json();
      const columnList: ColumnType[] = columnData.columns;
      setColumns(columnList);

      const allCards: Card[] = [];
      for (const column of columnList) {
        const cardRes = await fetch('http://43.203.124.34:5001/api/showCard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columnId: column.id }),
        });

        if (!cardRes.ok) continue;

        const cardData = await cardRes.json();
        const cardsInColumn: Card[] = cardData.cards.map((c: CardType): Card => ({
          id: c.id,
          text: c.title,
          details: c.card_desc ?? '',
          assignee: '',
          startDate: c.startDate ?? undefined,
          endDate: c.endDate ?? undefined,
          columnId: c.column_id,
        }));

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
    <CardContext.Provider value={{ columns, cards, loading, fetchCardsByProject, setCards, setProjectId, projectId }}>
      {children}
    </CardContext.Provider>
  );
};

export { CardContext };