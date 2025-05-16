import { useEffect, useState, useRef, useContext} from "react";
import { CardContext } from "../cardContext";
import type { Card } from "../cardContext";
import CardModal from "./CardModal";

type BoardProps = {
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
};

const Calendar = ({projectId}: BoardProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editYear, setEditYear] = useState(false);
  const [editMonth, setEditMonth] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth() + 1);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  const isScrolling = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const cardCon = useContext(CardContext);

  // 스크롤 이벤트 수동 등록 (preventDefault 작동 보장)
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

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

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

  const calendarDays = generateCalendar();
  console.log(cardCon.columns);
  console.log(cardCon.cards);
  return (
    <div
      ref={calendarRef}
      className="calendar-wrapper"
      style={{ width: "80%", margin: "auto", userSelect: "none", overflow: "hidden" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        {editYear ? (
          <input
            ref={inputRef}
            type="number"
            value={tempYear}
            onChange={e => setTempYear(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            style={{ width: "80px", textAlign: "center" }}
            autoFocus
          />
        ) : (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditYear(true);
              setTempYear(currentDate.getFullYear());
            }}
          >
            {currentDate.getFullYear()}년{" "}
          </span>
        )}

        {editMonth ? (
          <input
            ref={inputRef}
            type="number"
            value={tempMonth}
            onChange={e => setTempMonth(Number(e.target.value))}
            onKeyDown={handleKeyDown}
            style={{ width: "50px", textAlign: "center" }}
            autoFocus
          />
        ) : (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditMonth(true);
              setTempMonth(currentDate.getMonth() + 1);
            }}
          >
            {currentDate.getMonth() + 1}월
          </span>
        )}
      </h2>

      <div className="grid grid-cols-7 gap-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={i} className="text-center font-bold">{d}</div>
        ))}
        {calendarDays.map((day, idx) => (
          <div key={idx} className="min-h-15 text-center border border-gray-300 rounded-sm
">
            {day}
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