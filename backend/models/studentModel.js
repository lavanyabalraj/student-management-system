// =====================================================
// models/studentModel.js
// Data-access layer for the `students` table.
// =====================================================

const pool = require('../config/db');

// Get all students, optionally filtered by name (search feature)
const getAllStudents = async (searchName) => {
  if (searchName) {
    const [rows] = await pool.execute(
      'SELECT * FROM students WHERE name LIKE ? ORDER BY created_at DESC',
      [`%${searchName}%`]
    );
    return rows;
  }
  const [rows] = await pool.execute('SELECT * FROM students ORDER BY created_at DESC');
  return rows;
};

// Get a single student by id
const getStudentById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
  return rows[0];
};

// Create a new student record
const createStudent = async (student) => {
  const { name, department, age, gender, email, phone, address } = student;
  const [result] = await pool.execute(
    `INSERT INTO students (name, department, age, gender, email, phone, address)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, department, age, gender, email, phone, address]
  );
  return result.insertId;
};

// Update an existing student record
const updateStudent = async (id, student) => {
  const { name, department, age, gender, email, phone, address } = student;
  const [result] = await pool.execute(
    `UPDATE students
     SET name = ?, department = ?, age = ?, gender = ?, email = ?, phone = ?, address = ?
     WHERE id = ?`,
    [name, department, age, gender, email, phone, address, id]
  );
  return result.affectedRows;
};

// Delete a student record
const deleteStudent = async (id) => {
  const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
