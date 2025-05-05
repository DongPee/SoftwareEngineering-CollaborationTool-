import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import Link from "next/link";
import { getDarkMode, setDarkMode } from "./DarkState";
import UserDropdown from "./userProfile";

const Header = () => {
  const auth = useContext(AuthContext);
  const [darkMode, setDarkModeState] = useState(getDarkMode());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setDarkModeState(newMode);
  };

  const handleProfileClick = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <div className="header-wrapper">
      <header className="header">
        <Link href="/">
          <button type="button" className="title-button">Ollert</button>
        </Link>

        <div className="right-box">
          <button onClick={toggleMode} className="darkMode-button">
            {darkMode ? "Day" : "Night"}
          </button>

          {auth?.isLoggedIn ? (
            <div className="profile-wrapper">
              <button onClick={handleProfileClick} className="profile-button">
                {auth.username ?? "사용자"}
              </button>
              {showDropdown && (
                <UserDropdown onLogout={auth.logout} close={closeDropdown} />
              )}
            </div>
          ) : (
            <Link href="/frontend/login">
              <button className="login-button">log in</button>
            </Link>
          )}
        </div>
      </header>
      <div className="header-bottom-line"></div>
    </div>
  );
};

export default Header;
