import React from 'react';
import '../styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const range: number[] = [];
    const totalVisible = 5;

    let start = Math.max(currentPage - 2, 1);
    let end = start + totalVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - totalVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container text-center mt-4">
      <button
        className="btn btn-outline-light mx-1"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &larr; Prev
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`btn mx-1 ${page === currentPage ? 'btn-danger' : 'btn-outline-light'}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="btn btn-outline-light mx-1"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &rarr;
      </button>

      {/* Page indicator */}
      <p className="mt-3 text-light small">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default Pagination;
