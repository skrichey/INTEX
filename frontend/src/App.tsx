// src/App.tsx
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import MoviesPage from './pages/MoviesPage';
import PrivacyPage from './pages/PrivacyPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import AdminMoviesPage from './pages/AdminMoviesPage';
import CreateAccountPage from './pages/CreateAccountPage';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100 bg-dark text-white">
        {!isLanding && <Header />}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminMoviesPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
          </Routes>
        </main>
        {!isLanding && <Footer />}
      </div>
    </AuthProvider>
  );
}
