import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Shared pagination bar matching OfflineClassesTab styling.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px',
        flexWrap: 'wrap'
      }}
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
          color: currentPage === 1 ? '#94a3b8' : '#334155',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '0.88rem',
          transition: 'all 0.15s ease'
        }}
      >
        <ChevronLeft size={16} /> Trang trước
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: page === currentPage ? 'none' : '1px solid #cbd5e1',
            background: page === currentPage ? '#6366f1' : '#ffffff',
            color: page === currentPage ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
          color: currentPage === totalPages ? '#94a3b8' : '#334155',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '0.88rem',
          transition: 'all 0.15s ease'
        }}
      >
        Trang sau <ChevronRight size={16} />
      </button>
    </div>
  );
};

