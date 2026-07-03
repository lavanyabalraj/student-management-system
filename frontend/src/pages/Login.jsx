// =====================================================
// pages/Login.jsx
// Login form. On success, stores JWT (via AuthContext)
// and redirects to /dashboard.
// =====================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address';

    if (!form.password) errs.password = 'Password is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg({ type: '', text: '' });

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/login', form);
      login(res.data.user, res.data.token);
      setServerMsg({ type: 'success', text: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setServerMsg({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your Student Management System account</p>

        {serverMsg.text && (
          <div className={`alert ${serverMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {serverMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
