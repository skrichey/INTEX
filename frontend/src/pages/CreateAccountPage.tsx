import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://your-backend-url/api/auth/register', {
        email,
        password,
      });

      if (response.status === 200) {
        navigate('/login'); // redirect to login page
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2 className="mb-4">Create an Account</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <p className="text-danger">{errorMsg}</p>}

        <button type="submit" className="btn btn-danger">Sign Up</button>
      </form>
    </div>
  );
};

export default CreateAccountPage;


