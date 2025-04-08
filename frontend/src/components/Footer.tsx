import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-muted py-3 px-4 mt-5 border-top">
      <div className="container d-flex justify-content-between align-items-center small">
        <span>&copy; {new Date().getFullYear()} CineNiche. All rights reserved.</span>
        <Link to="/privacy" className="text-decoration-underline text-light">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
