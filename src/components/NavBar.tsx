import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <h1 className="brand">PokéDex+</h1>
      <div className="links">
        <NavLink to="/list" className={({isActive}) => isActive ? "active" : ""}>List</NavLink>
        <NavLink to="/gallery" className={({isActive}) => isActive ? "active" : ""}>Gallery</NavLink>
      </div>
    </nav>
  );
}
