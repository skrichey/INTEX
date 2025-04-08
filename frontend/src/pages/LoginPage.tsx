// src/pages/LoginPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Login to CineNiche</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" required />
          </div>
          <button type="submit" className="btn btn-danger w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          New to CineNiche? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;