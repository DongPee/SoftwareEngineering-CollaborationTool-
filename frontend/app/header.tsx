import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const auth = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <div className="header-wrapper  h-16 min-h-16">
      <header className="header">
        <Link href="/">
          <button type="button" className="title-button">
            Ollert
          </button>
        </Link>

        <div className="right-box">
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
            <Link href="/login">
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