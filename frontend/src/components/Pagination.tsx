import React from 'react';
import '../styles/Pagination.css'; // Import your CSS file for styling

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination-container">
      <button onClick={handlePrev} disabled={currentPage === 1}>
        ◀ Prev
      </button>
      <span className="pagination-info">Page {currentPage} of {totalPages}</span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;
