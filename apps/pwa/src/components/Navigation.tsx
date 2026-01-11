import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="nav">
      <NavLink to="/inventory">Inventaire</NavLink>
      <NavLink to="/recipes">Recettes</NavLink>
      <NavLink to="/plan">Planning</NavLink>
      <NavLink to="/shopping">Courses</NavLink>
      <NavLink to="/settings">Réglages</NavLink>
    </nav>
  );
};

export default Navigation;
