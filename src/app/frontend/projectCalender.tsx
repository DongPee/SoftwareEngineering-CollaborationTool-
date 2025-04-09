import { useEffect, useState, useRef } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editYear, setEditYear] = useState(false);
  const [editMonth, setEditMonth] = useState(false);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth() + 1);
  const isScrolling = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 스크롤로 월 이동
  const handleScroll = (e: React.WheelEvent) => {
    if (isScrolling.current) return;

    isScrolling.current = true;
    if (e.deltaY < 0) {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 2000/Math.abs(e.deltaY));
  };

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
    const newMonth = Math.min(Math.max(tempMonth, 1), 12); // 1~12 제한
    const newYear = tempYear;
    setCurrentDate(new Date(newYear, newMonth - 1, 1));
    setEditYear(false);
    setEditMonth(false);
  };

  // Enter로 적용
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyDateChange();
    }
  };

  // 외부 클릭 시 적용
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

  return (
    <div
      className="calendar-wrapper"
      onWheel={handleScroll}
      style={{ width: "80%", margin: "auto", userSelect: "none" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        {/* 연도 */}
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

        {/* 월 */}
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
          <div key={idx} className="min-h-15 text-center border border-gray-300">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;