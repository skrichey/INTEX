import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, FormControl } from 'react-bootstrap';
import '../styles/Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated =
    location.pathname.startsWith('/movies') || location.pathname.startsWith('/admin');

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
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

      {isAuthenticated ? (
        <div className="header-right">
          <div className="search-container">
            <FormControl
              type="text"
              placeholder="Search movies..."
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {showDropdown && (
              <div className="bg-dark border border-secondary rounded mt-1 position-absolute w-100 z-3">
                <p className="m-0 p-2 text-muted">Search results coming soon...</p>
              </div>
            )}
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
      ) : (
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
