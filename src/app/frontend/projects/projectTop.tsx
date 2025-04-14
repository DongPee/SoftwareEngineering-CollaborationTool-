import { getDarkMode } from "../DarkState";
import { useEffect } from "react";
const Top = () => {
  
  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);
  return (
    <div className="project-info">
        <div className="min-w-45 p-6 mr-5 gap-4">
            <div className="m-3">
                <h3 className="font-bold mb-2">프로젝트</h3>
                <h1 className="text-2xl inline-block mr-2">프로젝트이름</h1>
                <button id="projectNameButton"type="button">•••</button>
            </div>
        </div>
    </div>
    
  );
};

export default Top;