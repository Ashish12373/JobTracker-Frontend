import { useContext } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { ThemeContext } from "../Context/ThemeProvider";

const Layout = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token"); // check login state

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login"); // redirect to login page
  };

  return (
    <div className={theme}> {/* dark/light mode */}
      <header className="header-strip">
        <h1
          className="site-title"
          onClick={toggleTheme}
          style={{ cursor: "pointer" }}
        >
          JOB TRACKER
        </h1>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login">Jobs</Link>
                  </>
                ) : (
                  <Link to={`/${localStorage.getItem("username")}/jobs`}>Jobs</Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login">Login/Sign Up</Link>
             
            </>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                fontWeight: "bold",
                cursor: "pointer",
                marginLeft: "10px",
                fontFamily:"cursive",
                fontSize:"20px"
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;