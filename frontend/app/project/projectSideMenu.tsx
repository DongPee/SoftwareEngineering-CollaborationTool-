import Link from "next/link";
import { getDarkMode } from "../DarkState";
import { useEffect } from "react";

type SidebarProps = {
  active: string;  
  setActive: (value: string) => void;  
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
};

const Sidebar = ({ active, setActive }: SidebarProps) => {
  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);

  return (
    <div className="project-side-menu p-6 flex gap-4 h-full">
      <div className="m-3">
        <h2 className="font-bold mb-6">계획</h2>
        <nav className="project-side-menu-nav flex gap-3 flex-col">
          <button
            onClick={() => setActive("summary")}
            className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${
              active === "summary" ? "border-2 border-blue-400" : ""
            }`}
          >
            <span className="m-2">🌐요약</span>
          </button>

          <button
            onClick={() => setActive("timeline")}
            className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${
              active === "timeline" ? "border-2 border-blue-400" : ""
            }`}
          >
            <span className="m-2">📅타임라인</span>
          </button>

          <button
            onClick={() => setActive("board")}
            className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${
              active === "board" ? "border-2 border-blue-400" : ""
            }`}
          >
            <span className="m-2">보드</span>
          </button>

          <button
            onClick={() => setActive("calender")}
            className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${
              active === "calender" ? "border-2 border-blue-400" : ""
            }`}
          >
            <span className="m-2">캘린더</span>
          </button>

          <button
            onClick={() => setActive("chat")}
            className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${
              active === "chat" ? "border-2 border-blue-400" : ""
            }`}
          >
            <span className="m-2">채팅</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;