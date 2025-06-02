// components/UserDropdown.tsx
"use client";

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  useEffect(() => {
    const isDark =
      document.body.classList.contains("dark-mode") ||
      document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (!auth || !auth.username || !auth.email) return null;

  return (
    <div>
      <style jsx>{`
  .dropdown {
    position: absolute;
    right: 0;
    margin-top: 2rem;
    width: 20rem;
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: var(--bg-color);
    color: var(--text-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 50;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--text-color);
  }

  .username {
    font-size: 1rem;
    font-weight: bold;
  }

  .email {
    font-size: 0.85rem;
    color: var(--text-color);
    opacity: 0.8;
  }

  .button-group {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
    justify-content: center;
  }

  .button {
    width: 120px;
    height: 32px;
    border-radius: 10px;
    font-size: 13.5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    padding: 0 10px;
  }

  .profile-btn {
    background-color: var(--header-btn-bg-color);
    color: var(--text-color);
  }

  .profile-btn:hover {
    background-color: var(--header-btn-bg-hover);
  }

  .logout-btn {
    background-color: #f87171;
    color: white;
  }

  .logout-btn:hover {
    background-color: #ef4444;
  }
`}</style>
      <div ref={dropdownRef} className="dropdown">
        <div className="user-info">
          <div className="avatar">{auth.username.charAt(0).toUpperCase()}</div>
          <div>
            <p className="username">{auth.username}</p>
            <p className="email">{auth.email}</p>
          </div>
        </div>

        <div className="button-group">
          <Link href="/profile">
            <button className="button profile-btn">내 프로필</button>
          </Link>
          <button
            className="button logout-btn"
            onClick={() => {
              onLogout();
              close();
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
