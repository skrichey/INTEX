import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, FormControl } from 'react-bootstrap';
import '../styles/Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isAuthenticated = path.startsWith('/movies') || path.startsWith('/admin');
  const isLanding = path === '/';

  const [searchQuery, setSearchQuery] = useState('');

  // Load stored search when pathname changes (e.g., user navigates between pages)
  useEffect(() => {
    const stored = localStorage.getItem('adminSearchQuery') || '';
    setSearchQuery(stored);
  }, [path]);

  // Keep sync if adminSearchQuery changes outside the component (e.g. other tab)
  useEffect(() => {
    const syncSearch = () => {
      const stored = localStorage.getItem('adminSearchQuery') || '';
      setSearchQuery(stored);
    };
    window.addEventListener('storage', syncSearch);
    return () => window.removeEventListener('storage', syncSearch);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    localStorage.setItem('adminSearchQuery', query);
    window.dispatchEvent(new Event('storage')); // Let pages react
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="cineniche-header px-4 py-3">
      <Link to={isAuthenticated ? '/movies' : '/'} className="logo">
        CineNiche
      </Link>

      {isAuthenticated && (
        <div className="header-right">
          <div className="search-container">
            <FormControl
              type="text"
              placeholder="Search movies..."
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="account-dropdown" size="sm">
              Account
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-dark">
              <Dropdown.Item as={Link} to="/account">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {isLanding && (
        <div className="header-right">
          <Link to="/login" className="btn btn-danger login-button">
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
