import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ReaderModal.css';
import { useAuth } from '../../../contexts/AuthContext';

const EditReaderModal = ({ reader, onClose, onSave }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    dob: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reader) {
      setFormData({
        fullName: reader.fullName || '',
        phone: reader.phone || '',
        address: reader.address || '',
        dob: reader.dob ? reader.dob.slice(0, 10) : '',
      });
    }
  }, [reader]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/api/users/readers/${reader._id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(); // ✅ gọi lại để reload danh sách
    } catch (err) {
      console.error('Lỗi cập nhật độc giả:', err);
      alert('Cập nhật độc giả thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cập nhật thông tin độc giả</h3>

        <label>Mã độc giả</label>
        <input type="text" value={reader?.readerCode || ''} disabled />

        <label>Họ tên</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />

        <label>Email</label>
        <input type="email" value={reader?.email || ''} disabled />

        <label>Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>Ngày sinh</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default EditReaderModal;
