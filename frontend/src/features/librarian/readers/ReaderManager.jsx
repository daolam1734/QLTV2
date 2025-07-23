import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/ReaderManager.css';
import { useAuth } from '../../../contexts/AuthContext';
import EditReaderModal from './EditReaderModal';
import Swal from 'sweetalert2';

const ReaderManager = () => {
  const { user, token } = useAuth();
  const [readers, setReaders] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReader, setEditingReader] = useState(null);

  const limit = 8;

  const fetchReaders = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/users/readers?search=${search}&page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ ĐÃ FIX: lấy từ res.data.data
      setReaders(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải danh sách độc giả:', error);
    }
  }, [search, currentPage, token]);

  useEffect(() => {
    fetchReaders();
  }, [fetchReaders]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (reader) => {
    setEditingReader(reader);
  };

  const handleDelete = async (readerId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xoá',
      text: 'Bạn có chắc chắn muốn xoá độc giả này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/users/${readerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchReaders();

      Swal.fire({
        icon: 'success',
        title: 'Đã xoá',
        text: 'Độc giả đã được xoá thành công!',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Lỗi khi xoá độc giả:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xoá độc giả. Vui lòng thử lại sau.',
      });
    }
  };

  const closeModal = () => {
    setEditingReader(null);
  };

  const handleUpdateSuccess = () => {
    fetchReaders();
    closeModal();
  };

  return (
    <div className="manager-container">
      <h2 className="manager-title">Quản lý Độc giả</h2>

      <input
        type="text"
        placeholder="Tìm theo tên, email hoặc mã độc giả..."
        className="search-input"
        value={search}
        onChange={handleSearchChange}
      />

      <table className="manager-table">
        <thead>
          <tr>
            <th>Mã độc giả</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            {user.role === 'librarian' && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {readers.length === 0 ? (
            <tr>
              <td colSpan="5">Không tìm thấy độc giả.</td>
            </tr>
          ) : (
            readers.map((reader) => (
              <tr key={reader._id}>
                <td>{reader.readerCode || '—'}</td>
                <td>{reader.fullName}</td>
                <td>{reader.email}</td>
                <td>
                  {reader.createdAt
                    ? new Date(reader.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                {user.role === 'librarian' && (
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(reader)}>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(reader._id)}>
                      Xoá
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          &laquo; Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          Tiếp &raquo;
        </button>
      </div>

      {editingReader && (
        <EditReaderModal
          reader={editingReader}
          onClose={closeModal}
          onSave={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ReaderManager;
