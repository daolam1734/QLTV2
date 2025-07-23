import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateBorrowModal.css';
import { useAuth } from '../../../contexts/AuthContext';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CreateBorrowModal({ onClose, onBorrowCreated }) {
  const { token } = useAuth();
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);

  const [readerSearch, setReaderSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const [selectedReader, setSelectedReader] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const [borrowDate, setBorrowDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    fetchReaders();
    fetchBooks();
  }, []);

  const fetchReaders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/readers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReaders(res.data.data || []); // ✅ Sửa đúng với backend mới
    } catch {
      toast.error('❌ Không thể tải danh sách độc giả');
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data || []);
    } catch {
      toast.error('❌ Không thể tải danh sách sách');
    }
  };

  const handleToggleBook = (book) => {
    if (book.quantity <= 0) {
      toast.error(`⚠️ "${book.title}" đã hết sách`);
      return;
    }

    const isSelected = selectedBooks.find((b) => b._id === book._id);
    if (isSelected) {
      setSelectedBooks(selectedBooks.filter((b) => b._id !== book._id));
    } else {
      if (selectedBooks.length >= 3) {
        toast.error('⚠️ Chỉ được mượn tối đa 3 quyển');
        return;
      }
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const handleCreate = async () => {
    if (!selectedReader || selectedBooks.length === 0) {
      toast.error('⚠️ Vui lòng chọn độc giả và ít nhất 1 quyển sách');
      return;
    }

    if (!borrowDate || !returnDate) {
      toast.error('⚠️ Vui lòng chọn ngày mượn và ngày trả');
      return;
    }

    if (new Date(returnDate) <= new Date(borrowDate)) {
      toast.error('⚠️ Ngày trả phải sau ngày mượn');
      return;
    }

    try {
      const borrowData = {
        reader: selectedReader._id,
        books: selectedBooks.map((b) => ({
          book: b._id,
          quantity: 1,
        })),
        borrowDate,
        dueDate: returnDate,
      };

      await axios.post(`${API_BASE_URL}/api/borrows`, borrowData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('✅ Tạo phiếu mượn thành công');
      onBorrowCreated?.();
      handleReset();
    } catch (err) {
      toast.error('❌ Lỗi khi tạo phiếu mượn');
    }
  };

  const handleReset = () => {
    setSelectedReader(null);
    setSelectedBooks([]);
    setReaderSearch('');
    setBookSearch('');
    setReturnDate('');
    onClose?.();
  };

  const filteredReaders = readers.filter((reader) =>
    `${reader.fullName} ${reader.email} ${reader.readerCode} ${reader.phone}`
      .toLowerCase()
      .includes(readerSearch.toLowerCase())
  );

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.bookCode} ${book.author}`
      .toLowerCase()
      .includes(bookSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>📚 Tạo Phiếu Mượn Sách</h2>

        <div className="modal-section">
          {/* Độc giả */}
          <div className="modal-column">
            <label>🔍 Tìm độc giả:</label>
            <input
              type="text"
              placeholder="Tên, email, mã độc giả, SĐT..."
              value={readerSearch}
              onChange={(e) => setReaderSearch(e.target.value)}
            />
            <div className="scroll-table">
              <table className="select-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReaders.map((reader) => (
                    <tr
                      key={reader._id}
                      className={selectedReader?._id === reader._id ? 'selected-row' : ''}
                    >
                      <td>{reader.readerCode}</td>
                      <td>{reader.fullName}</td>
                      <td>{reader.email}</td>
                      <td>{reader.phone}</td>
                      <td>
                        <button onClick={() => setSelectedReader(reader)}>
                          {selectedReader?._id === reader._id ? '✓' : 'Chọn'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sách */}
          <div className="modal-column">
            <label>🔍 Tìm sách:</label>
            <input
              type="text"
              placeholder="Tên, mã sách, tác giả..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <div className="scroll-table">
              <table className="select-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Còn</th>
                    <th>Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookCode}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.quantity}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBooks.some((b) => b._id === book._id)}
                          onChange={() => handleToggleBook(book)}
                          disabled={
                            (!selectedBooks.some((b) => b._id === book._id) &&
                              selectedBooks.length >= 3) ||
                            book.quantity === 0
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <small>📌 Đã chọn: {selectedBooks.length} / 3 sách</small>

            {selectedBooks.length > 0 && (
              <div className="selected-books-list">
                <h4>📖 Sách đã chọn:</h4>
                <ul>
                  {selectedBooks.map((book) => (
                    <li key={book._id}>
                      {book.title} – {book.author}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Ngày mượn & trả */}
        <div className="date-section">
          <label>📅 Ngày mượn:</label>
          <input type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} />

          <label>📅 Ngày trả:</label>
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={handleCreate}
            disabled={!selectedReader || selectedBooks.length === 0 || !returnDate}
          >
            ✅ Tạo Phiếu Mượn
          </button>
          <button className="cancel-btn" onClick={handleReset}>
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
