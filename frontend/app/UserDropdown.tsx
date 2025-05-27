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
      className="absolute right-0 mt-8 w-80 h-30 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 z-50 p-6 flex flex-col justify-center"
      >
      {/* 프로필을 직접 설정하도록 할지? */}
      <div className="flex items-center gap-4 m-3">
        <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-white">
          {auth.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">{auth.username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{auth.email}</p>
        </div>
      </div>
      <div className="space-y-3">
        <Link href="/profile">
          <button className="w-1/2 px-5 py-5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition rounded-xl">
            내 프로필
          </button>
        </Link>
        <button
          onClick={() => {
            onLogout();
            close();
          }}
          className="w-1/2 px-5 py-5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-800 hover:bg-red-100 dark:hover:bg-red-700 transition rounded-xl"
          >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;