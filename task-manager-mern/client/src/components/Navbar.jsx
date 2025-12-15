import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-tasks text-2xl text-blue-500 mr-3"></i>
            <span className="text-xl font-bold text-gray-800 max-[500px]:hidden">Task Manager</span>
          </div>

          <div className="flex items-center">
            <div className="mr-6">
              <i className="fas fa-user text-gray-600 mr-2"></i>
              <span className="text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;