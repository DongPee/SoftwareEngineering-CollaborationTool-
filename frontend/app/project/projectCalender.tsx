'use client';
import { useState, useRef, useContext, useEffect } from "react";
import { CardContext } from "../cardContext";
import type { Card } from "../cardContext";
import CardModal from "./CardModal";
import styles from "./Calender.module.css";
import { io } from "socket.io-client";
import dayjs from "dayjs";
const socket = io("http://43.203.124.34:5001");

const Calendar = ({ projectId }: { projectId: string | null }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editYear, setEditYear] = useState(false);
  const [editMonth, setEditMonth] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth() + 1);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number>(null);
  const isScrolling = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cardCon = useContext(CardContext);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!calendarRef.current || !calendarRef.current.contains(e.target as Node)) return;

      e.preventDefault();

      if (isScrolling.current) return;
      isScrolling.current = true;

      const deltaY = e.deltaY;
      if (deltaY < 0) {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      } else {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 2000 / Math.abs(deltaY));
    };

    const calendarElement = calendarRef.current;
    if (calendarElement) {
      calendarElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    if (projectId && cardCon?.fetchCardsByProject) {
      cardCon.fetchCardsByProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
  const updateCards = () => {
    if (projectId && cardCon?.fetchCardsByProject) {
      cardCon.fetchCardsByProject(projectId);
    }
  };

  socket.on("isChanged", updateCards);
  socket.on("isModalChanged", updateCards);

  return () => {
    socket.off("isChanged", updateCards);
    socket.off("isModalChanged", updateCards);
  };
}, [projectId]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    return days;
  };

  const applyDateChange = () => {
    const newMonth = Math.min(Math.max(tempMonth, 1), 12);
    const newYear = tempYear;
    setCurrentDate(new Date(newYear, newMonth - 1, 1));
    setEditYear(false);
    setEditMonth(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyDateChange();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        if (editYear || editMonth) {
          applyDateChange();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editYear, editMonth]);

  const getCardForDay = (day: number): Card[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, day, 0, 0, 0, 0);

    return cardCon.cards.filter((card) => {
      const start = card.startDate ? new Date(card.startDate) : null;
      const end = card.endDate ? new Date(card.endDate) : null;
      if (!start || !end) return false;

      const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());

      return startDate <= date && date <= end;
    });
  };

  const calendarDays = generateCalendar();
  console.log(cardCon.columns);
  console.log(cardCon.cards);

  return (
    <div ref={calendarRef} className={styles.calendarWrapper}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>← 이전</button>

        <h2 className={styles.calendarTitle}>
          {editYear ? (
            <input
              ref={inputRef}
              type="number"
              value={tempYear}
              onChange={e => setTempYear(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              className={styles.yearInput}
              autoFocus
            />
          ) : (
            <span
              onClick={() => {
                setEditYear(true);
                setTempYear(currentDate.getFullYear());
              }}
              className={styles.clickableText}
            >
              {currentDate.getFullYear()}년
            </span>
          )}
          {" "}
          {editMonth ? (
            <input
              ref={inputRef}
              type="number"
              value={tempMonth}
              onChange={e => setTempMonth(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              className={styles.monthInput}
              autoFocus
            />
          ) : (
            <span
              onClick={() => {
                setEditMonth(true);
                setTempMonth(currentDate.getMonth() + 1);
              }}
              className={styles.clickableText}
            >
              {currentDate.getMonth() + 1}월
            </span>
          )}
        </h2>

        <button onClick={handleNextMonth} className={styles.navButton}>다음 →</button>
      </div>

      <div className={styles.grid7}>
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={i} className={styles.dayLabel}>{d}</div>
        ))}
      
        {calendarDays.map((day, idx) => (
          <div key={idx} className={styles.calendarCell}>
            {day && (
              <>
                <div className={styles.dayNumber}>{day}</div>
                {getCardForDay(day).map((card, i) => {
                  console.log('day:', day, '| i:', i, '| card:', card);
                  return (
                    <div
                      key={`${card.id}-${i}`}
                      className={`
                        ${styles.cardBar} 
                        ${hoveredCardId === card.id ? styles.cardBarHover : ''}
                        ${day === dayjs(card.startDate).date() ? 'rounded-l-lg' : ''}
                        ${day === dayjs(card.endDate).date() ? 'rounded-r-lg' : ''}
                      `}
                      style={{ top: `${30 + i * 24}px` }}
                      onMouseEnter={() => setHoveredCardId(card.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      onClick={() => setSelectedCard(card)}
                    >
                      {Math.floor((dayjs(card.endDate).date() + dayjs(card.startDate).date()) / 2) === day ? card.text : ''}
                    </div>
                  );
                })}
              </>
            )}
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
};

export default Calendar;