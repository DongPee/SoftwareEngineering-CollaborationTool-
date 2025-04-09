"use client"; // useState 사용을 위해 client component 선언
import App from "./backend/App";
import { useState } from "react";
import Sidebar from "./frontend/projectSideMenu";
import Board from "./frontend/projectBoard";
import Top from "./frontend/projectTop";
import Summary from "./frontend/projectSummary";
import Calendar from "./frontend/projectCalender";
export default function Page() {
  const [active, setActive] = useState("summary"); // active 상태 관리
  return (
    <div className="flex">
      <div>
        <Sidebar active={active} setActive={setActive} />
      </div>
      <div className="overflow-x-auto flex-grow">
        <Top />
        <h1 className="m-3">{active === "summary" ? "요약" : active === "timeline" ? "타임라인" : active === "board" ? "보드" : "캘린더"}</h1>
        {active === "summary" && <Summary />}
        {active === "timeline" && <h2>두 번째 페이지</h2>}
        {active === "board" && <Board />}
        {active === "calender" && <Calendar/>}
      </div>
    </div>
      
  );
}