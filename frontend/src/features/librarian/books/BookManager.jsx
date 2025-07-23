import { useEffect, useState } from 'react';
import BookTable from './BookTable';
import BookFormModal from './BookFormModal';
import Pagination from '../../../components/shared/Pagination';
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookSummary,
} from '../../../api/bookApi';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/BookManager.css';
import { useAuth } from '../../../contexts/AuthContext';

export default function BookManager() {
  const { token } = useAuth(); // ✅ lấy token từ context
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalTitles: 0,
    totalInStock: 0,
    totalBorrowedBooks: 0,
    totalAvailableBooks: 0,
  });

  const itemsPerPage = 5;

  useEffect(() => {
    loadBooks();
    loadSummary();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [books, searchTerm]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks(token); // ✅ gọi API `/books/manage` với token
      setBooks(data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Lỗi tải sách:', err);
      setErrorMessage('Không thể tải danh sách sách.');
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const res = await getBookSummary(token); // ✅ truyền token
      setSummary(res);
    } catch (err) {
      console.error('❌ Lỗi tải tổng quan sách:', err);
    }
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Sách sẽ bị xoá vĩnh viễn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    });

    if (result.isConfirmed) {
      try {
        await deleteBook(id, token);
        await loadBooks();
        await loadSummary();
        toast.success('Xoá sách thành công!');
      } catch (err) {
        const msg = err.response?.data?.message || 'Không thể xoá sách!';
        if (msg.includes('đang được mượn')) {
          Swal.fire({
            icon: 'error',
            title: 'Không thể xoá sách!',
            text: msg,
          });
        } else {
          toast.error(msg);
        }
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedBook) {
        await updateBook(selectedBook._id, formData, token);
        toast.success('Cập nhật sách thành công!');
      } else {
        await createBook(formData, token);
        toast.success('Thêm sách thành công!');
      }
      setShowModal(false);
      setErrorMessage('');
      await loadBooks();
      await loadSummary();
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi lưu sách.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleSearch = (term) => {
    const lower = term.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lower) ||
        book.author.toLowerCase().includes(lower) ||
        book.bookCode.toLowerCase().includes(lower)
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="book-manager-page">
      <div className="header-bar">
        <h2 className="title">📚 Quản lý sách</h2>
        <button className="add-book-btn" onClick={handleAdd}>
          ➕ Thêm sách mới
        </button>
      </div>

      <div className="summary-bar">
        <p><strong>📚 Đầu sách:</strong> {summary.totalTitles}</p>
        <p><strong>📦 Tổng số sách trong kho:</strong> {summary.totalInStock}</p>
        <p><strong>📕 Đang được mượn:</strong> {summary.totalBorrowedBooks}</p>
        <p><strong>📗 Còn lại:</strong> {summary.totalAvailableBooks}</p>
      </div>

      <div className="action-bar">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, tác giả, mã sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <p className="book-count">
        Đang hiển thị: <strong>{currentBooks.length}</strong> / Tổng: <strong>{books.length}</strong> sách
      </p>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading ? (
        <div className="loading">⏳ Đang tải sách...</div>
      ) : (
        <div className="table-wrapper">
          <BookTable
            books={currentBooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <BookFormModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setErrorMessage('');
        }}
        onSubmit={handleSubmit}
        bookData={selectedBook}
      />
    </div>
  );
}
