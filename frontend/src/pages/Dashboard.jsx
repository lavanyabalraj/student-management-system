// =====================================================
// pages/Dashboard.jsx
// Landing page after login. Shows welcome message and
// quick stats, plus navigation to Students page.
// =====================================================

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/students');
        setTotalStudents(res.data.length);
      } catch (err) {
        setTotalStudents(0);
      }
    };
    fetchCount();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="welcome-banner">
          <h2>Welcome back, {user?.name || 'User'} 👋</h2>
          <p>Here's a quick overview of your Student Management System.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Students</h3>
            <p style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
              {totalStudents === null ? '...' : totalStudents}
            </p>
          </div>

          <Link to="/students" className="dashboard-card" style={{ display: 'block' }}>
            <h3>Manage Students</h3>
            <p>Add, edit, search, and delete student records</p>
          </Link>

          <div className="dashboard-card">
            <h3>Logged in as</h3>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
