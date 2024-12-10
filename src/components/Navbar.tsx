// src/components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              HydroTracker
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/panel" 
              className={`px-3 py-2 rounded transition-colors ${
                location.pathname === '/panel' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Panel
            </Link>
            <Link 
              to="/configuracion" 
              className={`px-3 py-2 rounded transition-colors ${
                location.pathname === '/configuracion' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              Configuración
            </Link>
            <button
              onClick={logout}
              className="hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}