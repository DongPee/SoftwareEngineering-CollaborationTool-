'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';
import { CardContext, Card } from '../cardContext';
import CardModal from './CardModal';
import { io } from 'socket.io-client';

const socket = io('http://43.203.124.34:5001');
const CELL_WIDTH = 34;

export default function ProjectTimeline({ projectId }: { projectId: string | null }) {
  const cardCon = useContext(CardContext)!;
  const { cards, fetchCardsByProject } = cardCon;
  const [selectedCard, setSelectedAction] = useState<Card | null>(null);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().split('T')[0];
  };

  const getBarStyle = (startDate: string, endDate: string): React.CSSProperties => {
    const startIdx = dateRange.findIndex((d) => formatDate(d) === startDate.slice(0, 10));
    const endIdx = dateRange.findIndex((d) => formatDate(d) === endDate.slice(0, 10));

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return { display: 'none' };

    const left = startIdx * CELL_WIDTH;
    const width = (endIdx - startIdx + 1) * CELL_WIDTH;

    return {
      position: 'absolute',
      top: '8px',
      left: `${left}px`,
      width: `${width}px`,
    };
  };

  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 14);
    const range = Array.from({ length: 60 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
    setDateRange(range);
  }, []);

  useEffect(() => {
    const updateCards = () => {
      if (projectId) fetchCardsByProject(projectId);
    };

    socket.on('isChanged', updateCards);
    socket.on('isModalChanged', updateCards);

    return () => {
      socket.off('isChanged', updateCards);
      socket.off('isModalChanged', updateCards);
    };
  }, [projectId]);

  const expandDates = (direction: 'left' | 'right') => {
    const amount = 30;
    if (direction === 'left') {
      const first = dateRange[0];
      const newDates = Array.from({ length: amount }, (_, i) => {
        const d = new Date(first);
        d.setDate(first.getDate() - (amount - i));
        return d;
      });
      setDateRange([...newDates, ...dateRange]);
    } else {
      const last = dateRange[dateRange.length - 1];
      const newDates = Array.from({ length: amount }, (_, i) => {
        const d = new Date(last);
        d.setDate(last.getDate() + (i + 1));
        return d;
      });
      setDateRange([...dateRange, ...newDates]);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollLeft < 50) expandDates('left');
    if (el.scrollLeft + el.clientWidth > el.scrollWidth - 50) expandDates('right');
  };

  const getMonthLabel = (date: Date) => `${date.getMonth() + 1}월`;

  return (
    <div className={styles.timelineWrapper}>
      <h2 className={styles.timelineTitle}>타임라인</h2>

      <div className={styles.timelineContainer}>
        <div className={styles.taskColumn}>
          {cards.filter(c => c.startDate && c.endDate).map((card) => (
            <div key={card.id} className={styles.taskCell}>
              {card.text}
            </div>
          ))}
        </div>

        <div className={styles.scrollSyncWrapper} ref={scrollRef} onScroll={handleScroll}>
          <div className={styles.dateRow}>
            {dateRange.map((d, i) => {
              const isFirst = i === 0 || dateRange[i - 1].getMonth() !== d.getMonth();
              return (
                <div key={i} className={styles.dateCell}>
                  <div className={styles.dateContent}>
                    {isFirst && <span className={styles.monthLabel}>{getMonthLabel(d)}</span>}
                    <span className={styles.dateNumber}>{d.getDate()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.timelineBody}>
            {cards.filter(c => c.startDate && c.endDate).map((card) => (
              <div key={card.id} className={styles.taskRow}>
                <div className={styles.dateBarRow}>
                  <div
                    className={styles.bar}
                    style={getBarStyle(card.startDate!, card.endDate!)}
                    onClick={() => setSelectedAction(card)}
                  >
                    {card.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          setSelectedAction={setSelectedAction}
          projectId={projectId}
        />
      )}
    </div>
  );
}
