import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateBorrowModal from './CreateBorrowModal';
import ActionModal from './ActionModal';
import toast from 'react-hot-toast';
import '../styles/borrow.css';

const BorrowManager = () => {
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const borrowsPerPage = 5;

  const fetchBorrows = async () => {
    try {
      const res = await axios.get('/api/borrows');
      setBorrows(res.data);
      setFilteredBorrows(res.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách phiếu mượn');
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  useEffect(() => {
    const filtered = borrows.filter((b) =>
      b.reader?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reader?.readerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBorrows(filtered);
    setCurrentPage(1);
  }, [searchTerm, borrows]);

  const indexOfLast = currentPage * borrowsPerPage;
  const indexOfFirst = indexOfLast - borrowsPerPage;
  const currentBorrows = filteredBorrows.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBorrows.length / borrowsPerPage);

  return (
    <div className="borrow-manager">
      <h2>Quản lý phiếu mượn</h2>

      <div className="borrow-header">
        <input
          type="text"
          placeholder="Tìm theo tên độc giả, mã độc giả hoặc trạng thái..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowCreateModal(true)}>Tạo phiếu mượn</button>
      </div>

      <table className="borrow-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Mã phiếu</th>
            <th>Họ tên độc giả</th>
            <th>Mã độc giả</th>
            <th>Email</th>
            <th>Số sách</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Hạn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentBorrows.length === 0 ? (
            <tr><td colSpan="12">Không có phiếu mượn nào</td></tr>
          ) : (
            currentBorrows.map((borrow, idx) => {
              const reader = borrow.reader || {};
              const books = Array.isArray(borrow.books) ? borrow.books : [];

              const bookTitles = books.map((item) =>
                item?.book?.title ? `${item.book.title} x${item.quantity}` : ''
              ).filter(Boolean).join(', ') || '—';

              const totalQuantity = books.reduce((sum, item) => sum + (item.quantity || 0), 0);

              return (
                <tr key={borrow._id}>
                  <td>{indexOfFirst + idx + 1}</td>
                  <td>{borrow._id.slice(-6).toUpperCase()}</td>
                  <td>{reader.fullName || '—'}</td>
                  <td>{reader.readerCode || '—'}</td>
                  <td>{reader.email || '—'}</td>
                  <td>{totalQuantity}</td>
                  <td>{bookTitles}</td>
                  <td>{new Date(borrow.borrowDate).toLocaleDateString('vi-VN')}</td>
                  <td>{new Date(borrow.dueDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {borrow.returnDate
                      ? new Date(borrow.returnDate).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td>
                    <span className={`status-badge ${borrow.status}`}>
                      {borrow.status === 'borrowed'
                        ? 'Đang mượn'
                        : borrow.status === 'returned'
                        ? 'Đã trả'
                        : 'Quá hạn'}
                    </span>
                  </td>
                  <td>
                    {borrow.status !== 'returned' && (
                      <button
                        onClick={() => {
                          setSelectedBorrow(borrow);
                          setShowActionModal(true);
                        }}
                      >
                        Xử lý
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateBorrowModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchBorrows}
        />
      )}

      {showActionModal && selectedBorrow && (
        <ActionModal
          borrow={selectedBorrow}
          onClose={() => {
            setShowActionModal(false);
            setSelectedBorrow(null);
          }}
          onUpdated={fetchBorrows}
        />
      )}
    </div>
  );
};

export default BorrowManager;
