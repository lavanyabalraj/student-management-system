// =====================================================
// components/StudentDetails.jsx
// Read-only modal showing full details of one student.
// =====================================================

const StudentDetails = ({ student, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Student Details</h3>

        <div className="detail-row"><span>Name</span><span>{student.name}</span></div>
        <div className="detail-row"><span>Department</span><span>{student.department}</span></div>
        <div className="detail-row"><span>Age</span><span>{student.age}</span></div>
        <div className="detail-row"><span>Gender</span><span>{student.gender}</span></div>
        <div className="detail-row"><span>Email</span><span>{student.email}</span></div>
        <div className="detail-row"><span>Phone</span><span>{student.phone}</span></div>
        <div className="detail-row"><span>Address</span><span>{student.address}</span></div>
        <div className="detail-row">
          <span>Registered On</span>
          <span>{new Date(student.created_at).toLocaleDateString()}</span>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
