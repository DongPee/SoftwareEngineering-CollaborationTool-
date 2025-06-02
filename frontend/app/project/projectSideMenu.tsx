import Link from "next/link";
import { getDarkMode } from "../DarkState";
import { useEffect } from "react";

type SidebarProps = {
  active: string;
  setActive: (value: string) => void;
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

const Sidebar = ({
  active,
  setActive,
  projectId,
  projectName,
  projectDesc,
}: SidebarProps) => {
  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);

  const makeTabHref = (tab: string) => {
    if (!projectId || !projectName || !projectDesc) return "/projectList";
    return `/project/${projectId}/${projectName}/${projectDesc}?tab=${tab}`;
  };

  return (
    <div className="project-side-menu p-6 flex gap-4 h-full">
      <div className="m-3">
        <h2 className="font-bold mb-6">계획</h2>

        <nav className="project-side-menu-nav flex gap-3">
          <Link href={makeTabHref("summary")} onClick={() => setActive("summary")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "summary" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">🌐요약</span>
            </div>
          </Link>

          <Link href={makeTabHref("timeline")} onClick={() => setActive("timeline")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "timeline" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">타임라인</span>
            </div>
          </Link>

          <Link href={makeTabHref("board")} onClick={() => setActive("board")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "board" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">보드</span>
            </div>
          </Link>

          <Link href={makeTabHref("calender")} onClick={() => setActive("calender")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "calender" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">캘린더</span>
            </div>
          </Link>

          <Link href={makeTabHref("chat")} onClick={() => setActive("chat")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "chat" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">채팅</span>
            </div>
          </Link>

          <Link href={makeTabHref("log")} onClick={() => setActive("log")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "log" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">로그</span>
            </div>
          </Link>

          <Link href={makeTabHref("role")} onClick={() => setActive("role")}>
            <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "role" ? "border-2 border-blue-400" : ""}`}>
              <span className="m-2">역할 관리</span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
