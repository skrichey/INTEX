// src/pages/RegisterPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthPage.css';

const RegisterPage: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Create your CineNiche Account</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="confirmPassword" required />
          </div>
          <button type="submit" className="btn btn-danger w-100">Create Account</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
