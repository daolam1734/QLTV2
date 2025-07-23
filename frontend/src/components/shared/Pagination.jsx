import React from 'react';
import '../../styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        &laquo; Trước
      </button>
      <span>
        Trang {currentPage} / {totalPages}
      </span>
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Tiếp &raquo;
      </button>
    </div>
  );
};

export default Pagination;
