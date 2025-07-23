import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateViolationModal from './CreateViolationModal';
import toast from 'react-hot-toast';
import '../styles/ViolationManager.css';

const ViolationManager = () => {
  const [violations, setViolations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Lấy danh sách vi phạm
  const fetchViolations = async () => {
    try {
      const res = await axios.get('/api/violations');
      const data = res.data?.data;
      if (Array.isArray(data)) {
        setViolations(data);
      } else {
        toast.error('Phản hồi không hợp lệ từ máy chủ');
        setViolations([]);
      }
    } catch (err) {
      toast.error('Lỗi khi tải danh sách vi phạm');
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  // Đổi trạng thái vi phạm đã nộp
  const handleMarkAsPaid = async (violationId) => {
    try {
      await axios.put(`/api/violations/${violationId}/pay`);
      toast.success('Cập nhật trạng thái đã nộp thành công');
      // Cập nhật lại danh sách vi phạm
      fetchViolations();
    } catch {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  // Lọc vi phạm theo từ khóa
  const filtered = violations.filter((v) =>
    v.reader?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.reader?.readerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.violationType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="violation-manager">
      <h2>📒 Quản lý vi phạm</h2>
      <div className="violation-header">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã độc giả, lý do..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowCreateModal(true)}>+ Thêm vi phạm</button>
      </div>

      <table className="violation-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Mã vi phạm</th>
            <th>Độc giả</th>
            <th>Mã độc giả</th>
            <th>Loại vi phạm</th>
            <th>Tiền phạt</th>
            <th>Ngày ghi nhận</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="9">Không có vi phạm nào</td>
            </tr>
          ) : (
            filtered.map((violation, i) => (
              <tr key={violation._id}>
                <td>{i + 1}</td>
                <td>{violation.code || violation._id.slice(-6).toUpperCase()}</td>
                <td>{violation.reader?.fullName || '—'}</td>
                <td>{violation.reader?.readerCode || '—'}</td>
                <td>{violation.violationType || '—'}</td>
                <td>{violation.fineAmount?.toLocaleString('vi-VN')}đ</td>
                <td>{new Date(violation.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <span className={`status-badge ${violation.status}`}>
                    {violation.status === 'unpaid' ? 'Chưa nộp' : 'Đã nộp'}
                  </span>
                </td>
                <td>
                  {violation.status === 'unpaid' && (
                    <button
                      className="btn-paid"
                      onClick={() => handleMarkAsPaid(violation._id)}
                    >
                      Đánh dấu đã nộp
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showCreateModal && (
        <CreateViolationModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchViolations}
        />
      )}
    </div>
  );
};

export default ViolationManager;
