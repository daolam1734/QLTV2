import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/ActionModal.css';

const ActionModal = ({ borrow, onClose, onUpdated }) => {
  const [actionType, setActionType] = useState('extend');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

  const isReturned = borrow.status === 'returned';
  const isExtended = borrow.extended;

  const handleExtend = async () => {
    if (isReturned) return toast.error('Phiếu đã trả, không thể gia hạn');
    if (isExtended) return toast.error('Phiếu đã được gia hạn 1 lần');

    try {
      await axios.put(`/api/borrows/${borrow._id}/extend`);
      toast.success('Gia hạn thành công');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gia hạn');
    }
  };

  const handleReturn = async () => {
    if (isReturned) return toast.error('Phiếu đã được trả');

    try {
      await axios.put(`/api/borrows/${borrow._id}/return`, {
        returnDate,
      });
      toast.success('Trả sách thành công');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi trả sách');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>📘 Xử lý phiếu mượn</h3>

        <div className="action-switch">
          <button
            className={actionType === 'extend' ? 'active' : ''}
            onClick={() => setActionType('extend')}
          >
            Gia hạn
          </button>
          <button
            className={actionType === 'return' ? 'active' : ''}
            onClick={() => setActionType('return')}
          >
            Trả sách
          </button>
        </div>

        {actionType === 'extend' && (
          <div className="extend-info">
            <p>📅 Hạn cũ: {new Date(borrow.dueDate).toLocaleDateString()}</p>
            <p>👉 Sẽ được cộng thêm 15 ngày</p>
            <button
              onClick={handleExtend}
              disabled={isReturned || isExtended}
              className="primary-btn"
            >
              ✔️ Gia hạn
            </button>
          </div>
        )}

        {actionType === 'return' && (
          <div className="return-info">
            <label>Ngày trả:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <button
              onClick={handleReturn}
              disabled={isReturned}
              className="primary-btn"
            >
              ✔️ Trả sách
            </button>
          </div>
        )}

        <button onClick={onClose} className="cancel-btn">✖️ Đóng</button>
      </div>
    </div>
  );
};

export default ActionModal;
