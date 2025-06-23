// app/project/[...params]/page.tsx
"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthContext } from "../../AuthContext";
import Sidebar from "../projectSideMenu";
import Board from "../projectBoard";
import Top from "../projectTop";
import Summary from "../projectSummary";
import Calendar from "../projectCalender";
import Chat from "../projectChat";
import ProjectTimeline from "../projectTimeline";
import Log from "../ProjectLog";
import { useSearchParams } from "next/navigation";
import ProjectRole from "../projectRole";

export default function Project() {
  const router = useRouter();
  const params = useParams(); // App Router용
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [active, setActive] = useState(tab || "summary");
  
  const [projectId, encodedName, encodedDesc] = params.params || [];

  const projectName = decodeURIComponent(encodedName || "");
  const projectDesc = decodeURIComponent(encodedDesc || "");
  const auth = useContext(AuthContext);

  
  useEffect(() => {
    if (!auth?.isLoggedIn) {
      router.push("/");
    }
  }, [auth?.isLoggedIn]);

  return (
    <div className="allContent h-full">
      <div>
        <Sidebar
          projectId={projectId}
          projectName={projectName}
          projectDesc={projectDesc}
          active={active}
          setActive={setActive}
        />
      </div>
      <div className="overflow-x-auto flex-grow">
        <Top
          projectId={projectId}
          projectName={projectName}
          projectDesc={projectDesc}
        />
        <h1 className="m-3">
          {active === "summary"
            ? "요약"
            : active === "timeline"
            ? "타임라인"
            : active === "board"
            ? "보드"
            : active === "calender"
            ? "캘린더"
            : active === "log"
            ? "로그"
            : "채팅"}
        </h1>
        {active === "summary" && (
          <Summary
            projectId={projectId}
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
        {active === "timeline" && (
          <ProjectTimeline projectId={projectId} />
        )}
        {active === "board" && (
          <Board
            projectId={projectId}
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
        {active === "calender" && (
          <Calendar
            projectId={projectId}
          />
        )}
        {active === "chat" && (
          <Chat
            projectId={projectId}
          />
          )}
        {active === "log" && (
          <Log
            projectId={projectId}
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
        {active === "role" && (
          <ProjectRole
            projectId={projectId}
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
      </div>
    </div>
  );
}