import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      interface LoginResponse {
        message: string;
      }

      const response = await axios.post<LoginResponse>(
        'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api/auth/login',
        { email, password },
        { withCredentials: true } // Important: This allows secure cookie-based auth
      );

      console.log(response.data.message);
      navigate('/movies'); // Navigate to home or dashboard after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Login to CineNiche</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger w-100">Login</button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-3 text-center">
          <span>or</span>
        </div>

        <div className="btn btn-danger d-grid mt-3">
          <a
            href="https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/external-login/google"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: '20px', marginRight: '10px', verticalAlign: 'middle' }}
            />
            Sign in with Google
          </a>
        </div>

        <p className="mt-3 text-center">
          New to CineNiche? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
