// =====================================================
// components/StudentForm.jsx
// Modal form used for both "Add Student" and
// "Edit Student" (controlled by `initialData` prop).
// Includes full client-side validation.
// =====================================================

import { useState } from 'react';

const emptyForm = {
  name: '',
  department: '',
  age: '',
  gender: 'Male',
  email: '',
  phone: '',
  address: '',
};

const StudentForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initialData ? { ...initialData } : emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.department.trim()) errs.department = 'Department is required';

    if (!form.age) errs.age = 'Age is required';
    else if (Number(form.age) < 18 || Number(form.age) > 60) errs.age = 'Age must be between 18 and 60';

    if (!form.gender) errs.gender = 'Gender is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!emailRegex.test(form.email)) errs.email = 'Enter a valid email address';

    const phoneRegex = /^\d{10}$/;
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!phoneRegex.test(form.phone)) errs.phone = 'Phone must be exactly 10 digits';

    if (!form.address.trim()) errs.address = 'Address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? 'Edit Student' : 'Add Student'}</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Department</label>
              <input type="text" name="department" value={form.department} onChange={handleChange} />
              {errors.department && <div className="field-error">{errors.department}</div>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} />
              {errors.age && <div className="field-error">{errors.age}</div>}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <div className="field-error">{errors.gender}</div>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} maxLength={10} />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows="2" value={form.address} onChange={handleChange}></textarea>
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
