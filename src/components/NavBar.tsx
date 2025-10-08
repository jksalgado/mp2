import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="nav">
      <h1 className="brand">PokéDex+</h1>

      {/* was className="links" */}
      <div className="nav-buttons">
        {/* was className={({isActive}) => isActive ? "active" : ""} */}
        <NavLink
          to="/list"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          search
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          gallery
        </NavLink>
      </div>
    </nav>
  );
}
