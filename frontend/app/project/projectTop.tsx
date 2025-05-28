import { getDarkMode } from "../DarkState";
import { useEffect, useContext, useState } from "react";
import { handleInvite } from "./addDeleteBoardCard";
import { AuthContext } from "../AuthContext";
import { showUsers } from "./addDeleteBoardCard";
import Image from 'next/image';
type BoardProps = {
  projectId: string | null;
  projectName: string | null;
  projectDesc: string | null;
};

type User = {
  username: string;
  filter: string;
};

const Top = ({ projectName, projectId }: BoardProps) => {
  const auth = useContext(AuthContext);  
  const [users, setUsers] = useState<User[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [buttonToggle, setButtonToggle] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("dark-mode", getDarkMode());
  }, []);

  const generateRandomFilter = (): string => {
    const brightness = (Math.random() * 0.6 + 0.7).toFixed(2);
    const contrast = (Math.random() * 0.6 + 0.7).toFixed(2);
    const invert = Math.random() > 0.5 ? 1 : 0;
    return `brightness(${brightness}) contrast(${contrast}) invert(${invert})`;
  };


  useEffect(() => {
    const fetchUsernames = async () => {
      const options = await showUsers(projectId);
      const userListWithFilters = options.map((user: { username: string }) => ({
        username: user.username,
        filter: generateRandomFilter(),
      }));

      setUsers(userListWithFilters);
    };

    fetchUsernames();
  }, [projectId]);
  const visibleUsers = showAll ? users : users.slice(0, 3);
  const remainingUserCount = users.length - 3;
  
  return (
    <div className="project-info">
      <div className="min-w-45 p-6 mr-5 gap-4">
        <div className="m-3 flex items-center">
          <div>
            <h3 className="font-bold mb-2">프로젝트</h3>
            <h1 className="text-2xl inline-block mr-2">{projectName}</h1>
          </div>
          <button
            id="projectNameButton"
            className="ml-2"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setButtonToggle(!buttonToggle);
            }
          }>•••</button>
          {buttonToggle && (
            <>
            <button
            className="ml-2 px-2 py-1 border rounded relative group"
            onClick={() => {
              if (projectId && auth?.email) {
                handleInvite(projectId, auth.email);
              }
            }}
            type="button"
          >
            공유
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              초대 링크 복사
            </div>
          </button>

          <div className="flex ml-4 space-x-1">
            {visibleUsers.map((user, index) => (
              <div key={index} className="relative group">
                <Image
                  src="/default-user.png"
                  alt={user.username}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border"
                  style={{ filter: user.filter }}
                />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {user.username}
                </div>
              </div>
            ))}

            {remainingUserCount > 0 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-8 h-8 rounded-full border bg-gray-200 text-sm flex items-center justify-center hover:bg-gray-300"
              >
                +{remainingUserCount}
              </button>
            )}
          </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Top;