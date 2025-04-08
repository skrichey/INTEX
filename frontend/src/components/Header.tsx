import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, FormControl } from 'react-bootstrap';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = location.pathname.startsWith('/movies'); // Or use auth logic

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.trim().length > 0);
  };

  const handleLogout = () => {
    // Clear auth if needed
    navigate('/');
  };

  return (
    <header className="w-100 bg-black text-white px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
      <h1 className="h4 m-0 fw-bold">CineNiche</h1>

      {isLoggedIn && (
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <FormControl
              type="text"
              placeholder="Search movies..."
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '200px' }}
            />
            {showDropdown && (
              <div
                className="bg-dark border border-secondary rounded mt-1 position-absolute w-100 z-3"
                style={{ top: '100%' }}
              >
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
      )}
    </header>
  );
};

export default Header;
