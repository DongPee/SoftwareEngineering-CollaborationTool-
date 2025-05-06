import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Link from "next/link";
import { getDarkMode, setDarkMode } from "./DarkState";

const Header = () => {
  const auth = useContext(AuthContext);
  const [darkMode, setDarkModeState] = useState(getDarkMode()); 

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]); 

  const toggleMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode); 
    setDarkModeState(newMode); 
  };

  return (
    <header className="header h-16 min-h-16">
      <Link href="/">
        <button type="button" className="title-button">
          Ollert
        </button>
      </Link>
      <button onClick={toggleMode} className="darkMode-button">
            {darkMode ? "Day" : "Night"}
      </button>
      {auth?.isLoggedIn ? (
        <span className="user-status" onClick={auth.logout}>
          {auth?.isSocialLogin === "kakao"
            ? `${auth.username}님 (카카오 로그인)`
            : auth?.isSocialLogin === "goggle"
            ? `${auth.username}님 (구글 로그인)`
            : `${auth.username}님 (로그아웃)`}
        </span>
      ) : (
        <>
          <Link href="/frontend/login">
            <button className="login-button">log in</button>
          </Link>
        </>
      )}
    </header>
  );
};

export default Header;