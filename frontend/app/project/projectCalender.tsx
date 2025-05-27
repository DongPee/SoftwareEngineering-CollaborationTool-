'use client';
import { useState, useRef, useContext } from "react";
import { CardContext } from "../cardContext";
import type { Card } from "../cardContext";
import CardModal from "./CardModal";
import styles from "./Calender.module.css";

const Calendar = ({ projectId }: { projectId: string | null }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const cardCon = useContext(CardContext);
  const calendarRef = useRef<HTMLDivElement | null>(null);
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
    const days: (number | null)[] = Array(firstDay).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    return days;
  };

  const getCardForDay = (day: number): Card[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return cardCon.cards.filter((card) => {
      const start = card.startDate ? new Date(card.startDate) : null;
      const end = card.endDate ? new Date(card.endDate) : null;
      if (!start || !end) return false;
      const date = new Date(year, month, day);
      return start <= date && date <= end;
    });
  };

  const calendarDays = generateCalendar();

  return (
    <div ref={calendarRef} className={styles.calendarWrapper}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>← 이전</button>
        <h2 className={styles.calendarTitle}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
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
                {getCardForDay(day).map((card, i) => (
                  <div
                    key={i}
                    className={styles.cardBar}
                    style={{ top: `${30 + i * 24}px` }}
                    onClick={() => setSelectedCard(card)}
                  >
                    {card.text}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardModal card={selectedCard} setSelectedAction={setSelectedCard} projectId={projectId} />
      )}
    </div>
  );
};

export default Calendar;