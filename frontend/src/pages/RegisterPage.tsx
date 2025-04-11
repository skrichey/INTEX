import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AuthPage.css';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState<number | ''>(''); // Changed from string to number
  const [preferences, setPreferences] = useState<number[]>(Array(8).fill(0));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const platformLabels = [
    'Netflix', 'Amazon Prime', 'Disney+', 'Paramount+',
    'Max', 'Hulu', 'Apple TV+', 'Peacock'
  ];

  const handlePreferenceToggle = (index: number) => {
    setPreferences(prev => {
      const newPrefs = [...prev];
      newPrefs[index] = newPrefs[index] === 1 ? 0 : 1;
      return newPrefs;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        age,
        gender,
        city,
        state,
        zip,
        preferences,
      };

      const response = await axios.post(
        'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api/auth/register',
        payload
      );

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="mb-4">Create your CineNiche Account</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input type="number" className="form-control" required value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" required value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input type="text" className="form-control" required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">State</label>
            <input type="text" className="form-control" required value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Zip Code</label>
            <input type="number" className="form-control" required value={zip} onChange={(e) => setZip(Number(e.target.value))} />
          </div>

          <div className="mb-3" ref={dropdownRef}>
            <label className="form-label">Streaming Platform Preferences</label>
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle w-100 text-start"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {preferences.some(p => p === 1)
                  ? 'Selected: ' + platformLabels.filter((_, i) => preferences[i] === 1).join(', ')
                  : 'Select Streaming Platforms'}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu w-100 px-3 show position-static border mt-1">
                  {platformLabels.map((label, i) => (
                    <li key={i} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`platform-${i}`}
                        checked={preferences[i] === 1}
                        onChange={() => handlePreferenceToggle(i)}
                      />
                      <label className="form-check-label ms-2" htmlFor={`platform-${i}`}>
                        {label}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {errorMsg && <p className="text-danger">{errorMsg}</p>}

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
