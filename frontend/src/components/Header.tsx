import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, FormControl } from 'react-bootstrap';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = location.pathname.startsWith('/movies');

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="cineniche-header">
      <Link to="/" className="cineniche-logo">
        CineNiche
      </Link>

      {isLoggedIn && (
        <div className="header-controls">
          <div className="search-wrapper">
            <FormControl
              type="text"
              placeholder="Search titles..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {showDropdown && (
              <div className="search-dropdown">
                <p className="m-0 p-2 text-muted">Search results coming soon...</p>
              </div>
            )}
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="account-dropdown" size="sm" className="account-btn">
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
    </header>
  );
};

export default Header;
