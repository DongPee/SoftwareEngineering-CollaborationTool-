"use client"; // useState 사용을 위해 client component 선언
import { useState } from "react";
import Sidebar from "../projects/projectSideMenu";
import Board from "../projects/projectBoard";
import Top from "../projects/projectTop";
import Summary from "../projects/projectSummary";
import Calendar from "../projects/projectCalender";
export default function project() {
  const [active, setActive] = useState("summary"); // active 상태 관리
  return (
    <div className="allContent h-full">
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