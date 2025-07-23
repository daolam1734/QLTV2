import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/CreateViolationModal.css';

const CreateViolationModal = ({ onClose, onCreated }) => {
  const [readers, setReaders] = useState([]);
  const [formData, setFormData] = useState({
    readerId: '',
    violationType: '',
    description: '',
    fineAmount: '',
  });

  // 🔄 Load danh sách độc giả
  useEffect(() => {
    axios.get('/api/readers')
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          setReaders(data);
        } else {
          toast.error('Không có dữ liệu độc giả phù hợp');
        }
      })
      .catch(() => toast.error('Không thể tải danh sách độc giả'));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        fineAmount: Number(formData.fineAmount) || 0 // 🔢 ép kiểu số
      };

      await axios.post('/api/violations', payload);
      toast.success('Thêm vi phạm thành công');
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Thêm vi phạm thất bại');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Thêm vi phạm</h3>
        <form onSubmit={handleSubmit}>
          <label>Độc giả</label>
          <select
            name="readerId"
            value={formData.readerId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn độc giả --</option>
            {readers.map(r => (
              <option key={r._id} value={r._id}>
                {r.fullName} ({r.readerCode})
              </option>
            ))}
          </select>

          <label>Loại vi phạm</label>
          <input
            type="text"
            name="violationType"
            value={formData.violationType}
            onChange={handleChange}
            required
          />

          <label>Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />

          <label>Mức phạt (VNĐ)</label>
          <input
            type="number"
            name="fineAmount"
            value={formData.fineAmount}
            onChange={handleChange}
            min={0}
          />

          <div className="modal-actions">
            <button type="submit">Lưu</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateViolationModal;
