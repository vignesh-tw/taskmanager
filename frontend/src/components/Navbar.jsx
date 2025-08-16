import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const link = ({ isActive }) =>
    `mr-4 ${isActive ? 'underline' : ''}`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <NavLink to="/" className="text-2xl font-bold">Therapy Booking</NavLink>
      <div>
        {user ? (
          <>
            <NavLink to="/tasks" className={link}>Tasks</NavLink>
            <NavLink to="/therapists" className={link}>Therapists</NavLink>
            <NavLink to="/slots" className={link}>Slots</NavLink>
            <NavLink to="/bookings" className={link}>Bookings</NavLink>
            <NavLink to="/profile" className={link}>Profile</NavLink>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={link}>Login</NavLink>
            <NavLink
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
