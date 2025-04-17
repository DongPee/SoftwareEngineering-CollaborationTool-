import { getDarkMode } from "../DarkState";
import { useEffect, useContext } from "react";
import { handleInvite } from "./addDeleteBoardCard";
import { AuthContext } from "../AuthContext";
type BoardProps = {
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
};

const Top = ({ projectName, projectId }: BoardProps) => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);
  return (
    <div className="project-info">
        <div className="min-w-45 p-6 mr-5 gap-4">
            <div className="m-3">
                <h3 className="font-bold mb-2">프로젝트</h3>
                <h1 className="text-2xl inline-block mr-2">{projectName}</h1>
                <button id="projectNameButton inline-block"type="button">•••</button>
                <button 
                  onClick={() => {
                    if (projectId && auth?.email) {
                      handleInvite(projectId, auth.email);
                    }
                  }} 
                  type="button"
                >
                  공유하기
                </button>
            </div>
        </div>
        
    </div>
    
  );
};

export default Top;