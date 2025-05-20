'use client';

import { useContext, useEffect, useState } from 'react';
import styles from './Timeline.module.css';
import { CardContext, Card } from '../cardContext';
import CardModal from './CardModal';

type Props = {
  projectId: string | null;
};

function ProjectTimeline({ projectId }: Props) {
  const { cards } = useContext(CardContext);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // 60일 범위 날짜 생성 (오늘 기준 -30일 ~ +30일)
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 30);
  const dateRange = Array.from({ length: 60 }, (_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getBarStyle = (startDate: string, endDate: string) => {
    const startIdx = dateRange.findIndex(
      (d) => formatDate(d) === startDate.slice(0, 10)
    );
    const endIdx = dateRange.findIndex(
      (d) => formatDate(d) === endDate.slice(0, 10)
    );
    const left = startIdx * 28;
    const width = (endIdx - startIdx + 1) * 28;
    return { left: `${left}px`, width: `${width}px` };
  };

  return (
    <div className={styles.timelineWrapper}>
      <h2 className={styles.timelineTitle}>타임라인</h2>

      <div className={styles.timelineHeader}>
        <div className={styles.taskColumn}>업무</div>
        <div className={styles.dateRow}>
          {dateRange.map((d, i) => (
            <div key={i} className={styles.dateCell}>
              {d.getDate()}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timelineBody}>
        {cards
          .filter((card) => card.startDate && card.endDate)
          .map((card) => (
            <div key={card.id} className={styles.taskRow}>
              <div className={styles.taskColumn}>{card.text}</div>
              <div className={styles.dateBarRow}>
                <div
                  className={styles.bar}
                  style={getBarStyle(card.startDate!, card.endDate!)}
                  onClick={() => setSelectedCard(card)}
                >
                  {card.text}
                </div>
              </div>
            </div>
          ))}
      </div>

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

export default ProjectTimeline;
