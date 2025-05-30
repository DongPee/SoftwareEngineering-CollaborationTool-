'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';
import { CardContext, Card } from '../cardContext';
import CardModal from './CardModal';
import { io } from 'socket.io-client';

const socket = io('http://43.203.124.34:5001');

export default function ProjectTimeline({ projectId }: { projectId: string | null }) {
  const isScrolling = useRef(false);
  const cardCon = useContext(CardContext)!;
  const { cards, fetchCardsByProject } = cardCon;
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(34); // 기본값은 34px
  const [centerDate, setCenterDate] = useState<Date | null>(null);
  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().split('T')[0];
  };

  const getBarStyle = (startDate: string, endDate: string): React.CSSProperties => {
    const startIdx = dateRange.findIndex((d) => formatDate(d) === startDate.slice(0, 10));
    const endIdx = dateRange.findIndex((d) => formatDate(d) === endDate.slice(0, 10));

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) return { display: 'none' };

    const left = startIdx * cellWidth;
    const width = (endIdx - startIdx + 1) * cellWidth;

    return {
      position: 'absolute',
      top: '8px',
      left: `${left}px`,
      width: `${width}px`,
    };
  };

  useEffect(() => {
  if (projectId) {
    fetchCardsByProject(projectId);
  }
}, [projectId]);

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

    const scrollLeft = el.scrollLeft;
    const visibleCenter = scrollLeft + el.clientWidth / 2;
    const centerIndex = Math.floor(visibleCenter / cellWidth);
    if (dateRange[centerIndex]) {
      setCenterDate(dateRange[centerIndex]);
    }

    const nearLeftEdge = scrollLeft < 10;
    const nearRightEdge = scrollLeft + el.clientWidth > el.scrollWidth - 10;

    if (nearLeftEdge && !isScrolling.current) {
      isScrolling.current = true;
      expandDates('left');
      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    }

    if (nearRightEdge && !isScrolling.current) {
      isScrolling.current = true;
      expandDates('right');
      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    }
  };
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) { // Ctrl 키 + 마우스 휠
        e.preventDefault();
        setCellWidth((prev) => {
          const newWidth = Math.min(80, Math.max(20, prev + (e.deltaY > 0 ? -1  :1)));
          return newWidth;
        });
      }
    };

    const el = scrollRef.current;
    el?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  
  const getMonthLabel = (date: Date) => `${date.getMonth() + 1}월`;

  return (
    <div className={styles.timelineWrapper}>
      <h2 className={styles.timelineTitle}>
        타임라인
      </h2>
      {centerDate && (
        <div className={styles.centerDateLabel}>
          현재 날짜: {centerDate.getFullYear()}년 {centerDate.getMonth() + 1}월
        </div>
      )}
      <div className={styles.timelineContainer}>
        {/*
        <div className={styles.taskColumn}>
          {cards.filter(c => c.startDate && c.endDate).map((card) => (
            <div key={card.id} className={styles.taskCell}>{card.text}</div>
          ))}
        </div>
        */}
        <div className={styles.scrollSyncWrapper} ref={scrollRef} onScroll={handleScroll}>
          <div className={styles.dateRow}>
            {dateRange.map((d, i) => {
              const isFirst = i === 0 || dateRange[i - 1].getMonth() !== d.getMonth();
              return (
                <div
                  key={i}
                  className={styles.dateCell}
                  style={{ minWidth: `${cellWidth}px`, maxWidth: `${cellWidth}px` }}
                >
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
                    onClick={() => setSelectedCard(card)}
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
          setSelectedCard={setSelectedCard}
          projectId={projectId}
        />
      )}
    </div>
  );
}