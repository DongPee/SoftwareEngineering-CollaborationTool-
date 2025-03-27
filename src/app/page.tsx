"use client"; // useState 사용을 위해 client component 선언
import App from "./backend/App";
import { useState } from "react";
import Sidebar from "./frontend/menu";
import Board from "./frontend/board";

export default function Page() {
  const [active, setActive] = useState("home"); // active 상태 관리
  return (
    <div className="flex">
      <div>
        <Sidebar active={active} setActive={setActive} />
      </div>
      <div className="overflow-x-auto">
        <h1>{active === "summary" ? "요약" : active === "timeline" ? "타임라인" : "보드"}</h1><br></br>
        {active === "home" && <h1>첫 번째 페이지</h1>}
        {active === "profile" && <h2>두 번째 페이지</h2>}
        {active === "board" && <Board />}
      </div>
    </div>
    
  );
}