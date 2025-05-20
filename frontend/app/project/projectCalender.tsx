// components/projectCalender.tsx
import { useEffect, useState, useRef, useContext } from "react";
import { CardContext } from "../cardContext";
import type { Card } from "../cardContext";
import CardModal from "./CardModal";
import styles from "./Calendar.module.css";

// 날짜 범위 계산 함수
type BoardProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

const Calendar = ({ projectId }: BoardProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const cardCon = useContext(CardContext);

  const getMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
  const isBetween = (date: Date, start?: string, end?: string) => {
    if (!start || !end) return false;
    const d = date.getTime();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return d >= s && d <= e;
  };

  const calendarWeeks = getMonthCalendar();

  const getCardSpansForWeek = (week: (Date | null)[]) => {
    return cardCon.cards.map((card) => {
      if (!card.startDate || !card.endDate) return null;

      const start = new Date(card.startDate);
      const end = new Date(card.endDate);

      const startIdx = week.findIndex(day => day && isSameDay(day, start));
      const endIdx = week.findIndex(day => day && isSameDay(day, end));

      let offset = -1;
      let length = 0;
      for (let i = 0; i < 7; i++) {
        const date = week[i];
        if (date && isBetween(date, card.startDate, card.endDate)) {
          if (offset === -1) offset = i;
          length++;
        }
      }
      return offset !== -1 ? { card, offset, length } : null;
    }).filter(Boolean) as { card: Card; offset: number; length: number }[];
  };

  return (
    <div ref={calendarRef} className="calendar-wrapper p-4" style={{ width: "90%", margin: "auto" }}>
      <h2 className="text-center text-lg font-bold mb-4">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </h2>

      {calendarWeeks.map((week, weekIdx) => {
        const spans = getCardSpansForWeek(week);
        return (
          <div key={weekIdx} className="grid grid-cols-7 gap-1 relative h-20 border-t">
            {week.map((day, idx) => (
              <div key={idx} className="border text-xs p-1 relative h-full">
                {day ? day.getDate() : ""}
              </div>
            ))}
            {spans.map(({ card, offset, length }, i) => (
              <div
                key={i}
                className={styles.barWrapper}
                style={{ gridColumnStart: offset + 1, gridColumnEnd: `span ${length}` }}
              >
                <div
                  className={styles.cardBar}
                  onClick={() => setSelectedCard(card)}
                >
                  {card.text}
                </div>
              </div>
            ))}
          </div>
        );
      })}

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
