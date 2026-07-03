// =====================================================
// routes/studentRoutes.js
// All routes here are protected by the `protect`
// JWT middleware — a valid Bearer token is required.
// =====================================================

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStudents,
  getStudent,
  addStudent,
  editStudent,
  removeStudent,
} = require('../controllers/studentController');

router.use(protect); // applies to all routes below

router.get('/', getStudents);
router.get('/:id', getStudent);
router.post('/', addStudent);
router.put('/:id', editStudent);
router.delete('/:id', removeStudent);

module.exports = router;
