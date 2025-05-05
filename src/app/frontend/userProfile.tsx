import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import Link from "next/link";

type Props = {
  onLogout: () => void;
  close: () => void;
};

const UserDropdown = ({ onLogout, close }: Props) => {
  const auth = useContext(AuthContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  if (!auth || !auth.username || !auth.email) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="p-4 border-b dark:border-gray-600">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{auth.username}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{auth.email}</p>
      </div>
      <div className="p-2">
        <Link href="/frontend/profile">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            프로필 보기
          </button>
        </Link>
        <button
          onClick={() => {
            onLogout();
            close();
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
