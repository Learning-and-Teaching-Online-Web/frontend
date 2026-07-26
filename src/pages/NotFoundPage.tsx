import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary-color, #4f46e5)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Trang không tồn tại</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link 
        to="/" 
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Trở về Trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
