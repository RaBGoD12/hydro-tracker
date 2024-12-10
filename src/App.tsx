import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ConfiguracionUsuario from './components/ConfiguracionUsuario';
import PanelPrincipal from './components/PanelPrincipal';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const [metaDiaria, setMetaDiaria] = useState<number>(
    Number(localStorage.getItem('metaDiaria')) || 0
  );

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <main className="min-h-screen w-full">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              {metaDiaria ? 
                <Navigate to="/panel" replace /> : 
                <Navigate to="/configuracion" replace />}
            </ProtectedRoute>
          } />
          <Route path="/configuracion" element={
            <ProtectedRoute>
              <ConfiguracionUsuario setMetaDiaria={setMetaDiaria} />
            </ProtectedRoute>
          } />
          <Route path="/panel" element={
            <ProtectedRoute>
              <PanelPrincipal metaDiaria={metaDiaria} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;