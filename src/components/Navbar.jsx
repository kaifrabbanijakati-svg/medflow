import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ setIsAuthenticated }) {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-icon">􀫊</span> {/* SF Symbol approximation */}
          MedFlow
        </div>
        <ul className="nav-links">
          <li><NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink></li>
          <li><NavLink to="/medicines" className={({isActive}) => isActive ? "active" : ""}>Medicines</NavLink></li>
          <li><NavLink to="/billing" className={({isActive}) => isActive ? "active" : ""}>Billing</NavLink></li>
          <li><NavLink to="/alerts" className={({isActive}) => isActive ? "active" : ""}>Alerts</NavLink></li>
          <li>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="logout-btn"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
