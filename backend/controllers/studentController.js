// =====================================================
// controllers/studentController.js
// Handles CRUD business logic + validation for students.
// All routes using this controller are JWT-protected
// (see routes/studentRoutes.js).
// =====================================================

const studentModel = require('../models/studentModel');

// Reusable validator for student payloads
const validateStudent = (data) => {
  const { name, department, age, gender, email, phone } = data;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required');
  if (!department || !department.trim()) errors.push('Department is required');

  if (age === undefined || age === null || age === '') {
    errors.push('Age is required');
  } else if (Number(age) < 18 || Number(age) > 60) {
    errors.push('Age must be between 18 and 60');
  }

  if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
    errors.push('Gender must be Male, Female, or Other');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) errors.push('Valid email is required');

  const phoneRegex = /^\d{10}$/;
  if (!phone || !phoneRegex.test(phone)) errors.push('Phone must be exactly 10 digits');

  return errors;
};

// @route  GET /api/students?search=name
// @desc   Get all students (optionally filtered by name)
// @access Private
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const students = await studentModel.getAllStudents(search);
    return res.status(200).json(students);
  } catch (err) {
    console.error('Get students error:', err);
    return res.status(500).json({ message: 'Server error fetching students' });
  }
};

// @route  GET /api/students/:id
// @desc   Get a single student by id
// @access Private
const getStudent = async (req, res) => {
  try {
    const student = await studentModel.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    return res.status(200).json(student);
  } catch (err) {
    console.error('Get student error:', err);
    return res.status(500).json({ message: 'Server error fetching student' });
  }
};

// @route  POST /api/students
// @desc   Create a new student
// @access Private
const addStudent = async (req, res) => {
  try {
    const errors = validateStudent(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const insertId = await studentModel.createStudent(req.body);
    const newStudent = await studentModel.getStudentById(insertId);

    return res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (err) {
    console.error('Add student error:', err);
    return res.status(500).json({ message: 'Server error adding student' });
  }
};

// @route  PUT /api/students/:id
// @desc   Update an existing student
// @access Private
const editStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await studentModel.getStudentById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const errors = validateStudent(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    await studentModel.updateStudent(id, req.body);
    const updatedStudent = await studentModel.getStudentById(id);

    return res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    console.error('Edit student error:', err);
    return res.status(500).json({ message: 'Server error updating student' });
  }
};

// @route  DELETE /api/students/:id
// @desc   Delete a student
// @access Private
const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await studentModel.getStudentById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await studentModel.deleteStudent(id);
    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete student error:', err);
    return res.status(500).json({ message: 'Server error deleting student' });
  }
};

module.exports = { getStudents, getStudent, addStudent, editStudent, removeStudent };






