import React from 'react';
import '../styles/BookTable.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default function BookTable({ books = [], onEdit, onDelete, currentPage, itemsPerPage }) {
  const renderCover = (coverImage) => {
    if (!coverImage) return <span className="no-image">Không có ảnh</span>;

    const imageUrl = `${API_BASE_URL}/uploads/covers/${coverImage}`;
    return (
      <img
        src={imageUrl}
        alt="Ảnh bìa"
        className="cover-thumbnail"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  };

  return (
    <div className="book-table">
      <h2>📚 Danh sách sách</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh bìa</th>
              <th>Mã sách</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>NXB</th>
              <th>Năm</th>
              <th>Số lượng</th>
              <th>Đang mượn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{renderCover(book.coverImage)}</td>
                  <td>{book.bookCode || '—'}</td>
                  <td>{book.title || '—'}</td>
                  <td>{book.author || '—'}</td>
                  <td>{book.category || '—'}</td>
                  <td>{book.publisher || '—'}</td>
                  <td>{book.year || '—'}</td>
                  <td>{book.quantity ?? 0}</td>
                  <td>{book.currentlyBorrowed ?? 0}</td>
                  <td>
                    <button className="edit-btn" onClick={() => onEdit(book)}>Sửa</button>
                    <button className="delete-btn" onClick={() => onDelete(book._id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-data">Không có sách nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
