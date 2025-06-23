"use client";

import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "../AuthContext";
import LoginPage from "../login/page";
import styles from "../signup/signup.module.css";

const classyColors = [
    "bg-rose-200", "bg-sky-200", "bg-lime-200",
    "bg-emerald-200", "bg-indigo-200", "bg-orange-200",
    "bg-teal-200", "bg-violet-200"
];

interface Project {
    sharing : boolean;
    id: number;
    name: string;
    desc: string;
    color: string;
    editing: boolean;
}
interface Pro {
  project_id: number;
  name: string;
  description: string;
}
export default function ProjectSelector() {
    const auth = useContext(AuthContext);
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [description, setNewDescription] = useState("");
    const [isComposing, setIsComposing] = useState(false); // 한글 조합 중인지 여부

    const projectList = async () => {
        const email = auth?.email ?? "";
        try {
            const response = await fetch("http://43.203.124.34:5001/api/showProjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();

                const loadedProjects: Project[] = data.projects.map((proj: Pro) => ({
                    id: proj.project_id,
                    name: proj.name,
                    desc: proj.description ?? "",
                    color: classyColors[Math.floor(Math.random() * classyColors.length)],
                    editing: false,
                }));
                setProjects(loadedProjects);
            }
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

    const addProject = async () => {
        if (newProjectName.trim() === "" || description.trim() === "") return; // 둘 다 입력해야만 추가됨
    
        const email = auth?.email ?? "";
        const name = newProjectName.trim();
        const desc = description.trim();
        try {
            const response = await fetch("http://43.203.124.34:5001/api/createProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, desc }),
            });
    
            if (!response.ok) {
                throw new Error("프로젝트 생성 실패");
            }
    
            const result = await response.json();
            console.log(result);
            const newProject: Project = {
                id: result.id, // 서버에서 반환된 프로젝트 ID를 설정
                name,
                desc,
                color: classyColors[Math.floor(Math.random() * classyColors.length)],
                editing: false,
                sharing : false,
            };
    
            setProjects(prev => [...prev, newProject]);
            setNewProjectName(""); // 프로젝트 추가 후 입력창 초기화
            setNewDescription(""); // 설명 초기화
            projectList();
        } catch (err) {
            console.error("프로젝트 생성 오류:", err);
            alert("프로젝트 생성에 실패했습니다.");
        }
    };

    const deleteProject = async (projectId: number) => {
        const email = auth?.email ?? "";
        console.log(projectId);
        console.log(email);
        try {
            const response = await fetch("http://43.203.124.34:5001/api/deleteProject", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId, email}),
            });
    
            if (!response.ok) {
                throw new Error("프로젝트 삭제 실패");
            }
    
            // 삭제된 프로젝트는 상태에서 제거
            setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        } catch (err) {
            console.error("프로젝트 삭제 오류:", err);
            alert("프로젝트 삭제에 실패했습니다.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isComposing && newProjectName !== "" && description !== "") {
            addProject();
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const toggleEdit = (index: number) => {

        setProjects(prev =>
            prev.map((proj, i) =>
                i === index ? { ...proj, editing: !proj.editing } : proj
            )
        );
    };

    const updateNameDesc = async (index: number) => {
        const projectId = projects[index].id;
        const name = projects[index].name;
        const desc = projects[index].desc;
        if(!projectId || !name || !desc){
            alert("잠시 후 다시 시도해주세요.");
            return;
        }
        console.log(projectId, name, desc);
        try {
            const response = await fetch("http://43.203.124.34:5001/api/updateProjectNameDesc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({projectId, name, desc}),
            });
            if (!response.ok) {
                throw new Error("프로젝트 삭제 실패");
            }    
        } catch (err) {
            console.error("프로젝트 삭제 오류:", err);
            alert("프로젝트 삭제에 실패했습니다.");
        }
            
    };
    const updateName = (index: number, name: string) => {
        setProjects(prev =>
            prev.map((proj, i) =>
                i === index ? { ...proj, name } : proj
            )
        );
    };

    const updateDesc = (index: number, desc: string) => {
        setProjects(prev =>
            prev.map((proj, i) =>
                i === index ? { ...proj, desc } : proj
            )
        );
    };

    const handleEditKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            const project = projects[index];
    
            try {
                const response = await fetch("http://43.203.124.34:5001/api/updateProject", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        projectId: project.id,
                        name: project.name,
                        desc: project.desc,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error("프로젝트 수정 실패");
                }
    
                toggleEdit(index); // 편집 종료
            } catch (err) {
                console.error("프로젝트 수정 오류:", err);
                alert("프로젝트 수정에 실패했습니다.");
            }
        }
    };
    return (
        <>
            {!auth?.isLoggedIn ? (
                <LoginPage />
            ) : (
                <div className="w-full h-14/15 flex flex-col items-center justify-center px-6">
                    <div className={styles.inputGroup}>
                        {!newProjectName && (
                            <button
                                onClick={() => setNewProjectName(" ")} // 빈 값이 아닌 문자열로 입력창 활성화
                                className="hover:text-blue-400 font-semibold py-2 px-4 rounded-lg mb-6 border-2"
                            >
                                <p className="m-2">새 프로젝트 만들기</p>
                            </button>
                        )}

                        {newProjectName !== "" && (
                            <div className="flex flex-col items-start w-full">
                                <label>프로젝트 이름</label>
                                <input
                                    type="text"
                                    placeholder="새 프로젝트 이름 입력 후 Enter"
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={handleCompositionEnd}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <label>프로젝트 설명</label>
                                <input
                                    type="text"
                                    placeholder="새 프로젝트 설명 입력 후 Enter"
                                    value={description}
                                    onChange={e => setNewDescription(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onCompositionStart={handleCompositionStart}
                                    onCompositionEnd={handleCompositionEnd}
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <p
                                    onClick={() => setNewProjectName("")}
                                    className="hover:text-blue-400 font-bold">취소
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="w-full max-w-3xl h-[400px] overflow-y-auto space-y-4">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className={`${styles.projectListColor} flex justify-between items-center rounded-2xl shadow-sm ${project.color} transition mx-10`}
                            >
                                
                                {project.editing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={project.name}
                                            onChange={(e) => updateName(index, e.target.value)}
                                            onKeyDown={(e) => handleEditKeyDown(e, index)}
                                            className="rounded w-1/2 min-h-7 m-4"
                                        />
                                        <input
                                            type="text"
                                            value={project.desc}
                                            onChange={(e) => updateDesc(index, e.target.value)}
                                            onKeyDown={(e) => handleEditKeyDown(e, index)}
                                            className="rounded w-1/2 min-h-7 m-4"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <span className={`${styles.projectName} text-lg font-semibold m-4`}>
                                            {project.name}
                                        </span>
                                        <span className={`${styles.projectName} text-sm ml-4 mb-2`}>{project.desc}</span>
                                    </>
                                )}
                                <div className="flex gap-2">
                                    {project.editing && (
                                        <button
                                            onClick={() => deleteProject(project.id)}
                                            className="border-2 border-black text-black text-sm rounded hover:bg-red-200 mr-1"
                                        >
                                            <p className="m-2">X</p>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (project.editing) {
                                                updateNameDesc(index);
                                            }
                                            toggleEdit(index);
                                        }}
                                        className="border-2 border-black text-black text-sm rounded hover:bg-gray-100 mr-1"
                                    >
                                        <p className="m-2">{project.editing ? "✓" : "✎"}</p>
                                    </button>

                                    <Link href={
                                        `/${project.id ? `project/${project.id}/${encodeURIComponent(project.name)}/${encodeURIComponent(project.desc)}` : "projectList"}`
                                    }>
                                        <button className="border-2 border-black text-black text-sm rounded hover:bg-white mr-3">
                                            <p className="m-2">➡️</p>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}