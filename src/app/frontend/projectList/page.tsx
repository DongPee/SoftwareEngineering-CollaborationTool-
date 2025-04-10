"use client";

import { useState, useContext, useEffect} from "react";
import Link from "next/link";
import { AuthContext } from "../AuthContext";
import LoginPage from "../login/page";
const classyColors = [
    "bg-rose-200", "bg-sky-200", "bg-lime-200",
    "bg-emerald-200", "bg-indigo-200", "bg-orange-200",
    "bg-teal-200", "bg-violet-200"
];

interface Project {
    name: string;
    color: string;
    editing: boolean;
}

export default function ProjectSelector() {
    const auth = useContext(AuthContext);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const projectList = async () => {
        const username = auth?.username ?? "no data";
        console.log("보내는 username:", username);
        try {
            const response = await fetch("http://localhost:5001/api/showProjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });
    
            if (!response.ok) {
                throw new Error("프로젝트 목록 불러오기 실패");
            }
    
            const data = await response.json();
            console.log("받은 프로젝트 데이터:", data);
    
            // 백엔드에서 { projects: [{ name: "..." }, ...] } 형식으로 보낸다고 가정
            const loadedProjects: Project[] = data.projects.map((proj: any) => ({
                name: proj.name,
                color: classyColors[Math.floor(Math.random() * classyColors.length)],
                editing: false
            }));
    
            setProjects(loadedProjects);
        } catch (err) {
            console.error("서버 오류:", err);
            alert("서버 오류가 발생했습니다.");
        }
    };
    useEffect(() => {
        if (auth?.isLoggedIn) {
          projectList(); // 로그인 되어 있으면 프로젝트 리스트 가져오기
        }
      }, [auth?.isLoggedIn]);
    const addProject = () => {
    if (newProjectName.trim() === "") return;

    const newProject: Project = {
            name: newProjectName.trim(),
            color: classyColors[Math.floor(Math.random() * classyColors.length)],
            editing: false
        };

        setProjects(prev => [...prev, newProject]);
        setNewProjectName("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addProject();
    };

    const toggleEdit = (index: number) => {
        setProjects(prev =>
            prev.map((proj, i) =>
                i === index ? { ...proj, editing: !proj.editing } : proj
            )
        );
    };

    const updateName = (index: number, name: string) => {
        setProjects(prev =>
            prev.map((proj, i) =>
                i === index ? { ...proj, name } : proj
            )
        );
    };

    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            toggleEdit(index);
        }
    };

    return (
        <>
            {!auth?.isLoggedIn ? (
                <>
                    <LoginPage />
                </>
            ):(
                <div className="w-full h-14/15 bg-white flex flex-col items-center justify-center px-6">
                    <h1 className="text-3xl font-bold mb-6">나의 프로젝트</h1>

                    <input
                        type="text"
                        placeholder="새 프로젝트 이름 입력 후 Enter"
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <div className="w-full max-w-3xl h-[400px] overflow-y-auto space-y-4">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={`flex justify-between items-center rounded-2xl shadow-sm ${project.color} transition mx-10`}
                            >
                                {project.editing ? (
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => updateName(index, e.target.value)}
                                        onKeyDown={(e) => handleEditKeyDown(e, index)}
                                        className="rounded w-1/2 min-h-7 m-4"
                                        
                                    />
                                ) : (
                                    <span className="text-lg font-semibold m-4">{project.name}</span>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleEdit(index)}
                                        className="border-2 border-black text-sm rounded hover:bg-gray-100 mr-1"
                                    >
                                        <p className="m-2">{project.editing ? "✓" : "✎"}</p>
                                    </button>

                                    <Link href="/frontend/project">
                                        <button className="border-2 border-black text-black text-sm rounded hover:bg-white mr-3">
                                            <p className="m-2">➡️</p>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )};
        </>
    );
}