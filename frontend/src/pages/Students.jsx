// =====================================================
// pages/Students.jsx
// Main student management page:
// - fetches & displays students in a table
// - search by name (debounced-ish via onChange)
// - add / edit via StudentForm modal
// - view details via StudentDetails modal
// - delete with ConfirmModal
// =====================================================

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import StudentForm from '../components/StudentForm.jsx';
import StudentDetails from '../components/StudentDetails.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import api from '../api/axios.js';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStudents = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/students', { params: searchTerm ? { search: searchTerm } : {} });
      setStudents(res.data);
    } catch (err) {
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search with a small debounce so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(search);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleAdd = async (formData) => {
    setActionLoading(true);
    try {
      await api.post('/students', formData);
      setShowForm(false);
      fetchStudents(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    setActionLoading(true);
    try {
      await api.put(`/students/${editingStudent.id}`, formData);
      setEditingStudent(null);
      fetchStudents(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/students/${deletingStudent.id}`);
      setDeletingStudent(null);
      fetchStudents(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="students-header">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowForm(true)}>
            + Add Student
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading-text">Loading students...</div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : students.length === 0 ? (
            <div className="empty-state">No students found.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.department}</td>
                      <td>{s.age}</td>
                      <td>{s.gender}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn view" onClick={() => setViewingStudent(s)}>View</button>
                          <button className="icon-btn edit" onClick={() => setEditingStudent(s)}>Edit</button>
                          <button className="icon-btn delete" onClick={() => setDeletingStudent(s)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <StudentForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          loading={actionLoading}
        />
      )}

      {editingStudent && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleEdit}
          onCancel={() => setEditingStudent(null)}
          loading={actionLoading}
        />
      )}

      {viewingStudent && (
        <StudentDetails student={viewingStudent} onClose={() => setViewingStudent(null)} />
      )}

      {deletingStudent && (
        <ConfirmModal
          title="Delete Student"
          message={`Are you sure you want to delete "${deletingStudent.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingStudent(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default Students;
