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

export default function Project() {
  const [active, setActive] = useState("summary");
  const router = useRouter();
  const params = useParams(); // App Router용

  const [projectId, projectName, projectDesc] = params.params || [];
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
        {active === "timeline" && <ProjectTimeline projectId={projectId} />}
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
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
        {active === "chat" && <Chat />}
        {active === "log" && (
          <Log
            projectId={projectId}
            projectName={projectName}
            projectDesc={projectDesc}
          />
        )}
      </div>
    </div>
  );
}
