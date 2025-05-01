"use client"; // useState 사용을 위해 client component 선언
import { useState, useEffect, useContext} from "react";
import { useRouter } from "next/navigation"; 
import Sidebar from "./projectSideMenu";
import Board from "./projectBoard";
import Top from "./projectTop";
import Summary from "./projectSummary";
import Calendar from "./projectCalender";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "../AuthContext";

export default function project() {
  const [active, setActive] = useState("summary"); // active 상태 관리
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const projectName = searchParams.get("projectName");
  const projectDesc = searchParams.get("projectDesc");
  const auth = useContext(AuthContext);
  const router = useRouter(); 
  
  useEffect(() => {
      if (!auth?.isLoggedIn) {
        router.push("/");
      }
    }, [auth?.isLoggedIn]);
  return (
    <div className="allContent h-full">
      <div>
        <Sidebar projectId={projectId} projectName={projectName} projectDesc={projectDesc} active={active} setActive={setActive} />
      </div>
      <div className="overflow-x-auto flex-grow">
        <Top projectId={projectId} projectName={projectName} projectDesc={projectDesc} />
        <h1 className="m-3">{active === "summary" ? "요약" : active === "timeline" ? "타임라인" : active === "board" ? "보드" : "캘린더"}</h1>
        {active === "summary" && <Summary projectId={projectId} projectName={projectName} projectDesc={projectDesc} />}
        {active === "timeline" && <h2>두 번째 페이지</h2>}
        {active === "board" && <Board projectId={projectId} projectName={projectName} projectDesc={projectDesc} />}
        {active === "calender" && <Calendar projectId={projectId} projectName={projectName} projectDesc={projectDesc} />}
      </div>
    </div>
      
  );
}