import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../../config/axiosConfig";
import "./Navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("/user.png");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true; // avoid state update warning

    const checkAuth = async () => {
      try {
        const res = await API.get("/auth/profile", { withCredentials: true });

        if (!mounted) return;

        if (res.data?.user) {
          setLoggedIn(true);
          setAvatar(res.data.user.avatar || "/user.png");
        }
      } catch (err) {
        if (mounted) {
          setLoggedIn(false);
          setAvatar("/user.png");
        }
      }
    };

    checkAuth();
    return () => (mounted = false);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
       localStorage.removeItem("utoken");
      setLoggedIn(false);
      setAvatar("/user.png");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">

        {/* LOGO */}
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          {/* <span className="logo-text">Fix-of-India</span> */}
        </NavLink>

        {/* DESKTOP LINKS */}
        <ul className="navbar-links">
          <li><NavLink to="/" className="nav-item">Home</NavLink></li>
          <li><NavLink to="/service" className="nav-item">Services</NavLink></li>
          <li><NavLink to="/worker" className="nav-item">Partners</NavLink></li>
          <li><NavLink to="/about" className="nav-item">About</NavLink></li>
          <li><NavLink to="/contact" className="nav-item">Contact Us</NavLink></li>
          <li><NavLink to="admin" className="wl-link">
            Admin
          </NavLink></li>
        </ul>

        {/* RIGHT SIDE (Profile / Login) */}
        {loggedIn ? (
          <div className="profile-actions">
            <NavLink to="/profile" className="profile-btn">
              <img src={avatar} alt="User" className="profile-img" />
            </NavLink>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <NavLink to="/login" className="login-btn">Login</NavLink>
            <NavLink to="/register" className="signup-btn">Signup</NavLink>
          </div>
        )}

        {/* MOBILE MENU TOGGLE */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          <ul>
            <li><NavLink to="/" onClick={() => setOpen(false)} className="nav-item">Home</NavLink></li>
            <li><NavLink to="/service" onClick={() => setOpen(false)} className="nav-item">Services</NavLink></li>
            <li><NavLink to="/worker" onClick={() => setOpen(false)} className="nav-item">Partners</NavLink></li>
             <li><NavLink to="/about" onClick={() => setOpen(false)} className="nav-item">About</NavLink></li>
             <li><NavLink to="/contact" onClick={() => setOpen(false)} className="nav-item">Contact Us</NavLink></li>
          </ul>

          {loggedIn ? (
            <div className="mobile-auth">
              <NavLink to="/profile" onClick={() => setOpen(false)} className="mobile-profile">
                <img src={avatar} alt="User" className="mobile-profile-img" />
              </NavLink>
              <button className="mobile-logout" onClick={() => { handleLogout(); setOpen(false); }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth">
              <NavLink to="/login" onClick={() => setOpen(false)} className="mobile-login">Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)} className="mobile-signup">Signup</NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}






