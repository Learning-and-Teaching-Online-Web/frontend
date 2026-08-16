import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import { DollarSign, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface WalletTabProps {
  walletBalance: number;
  transactions: any[];
  formatVND: (n: number) => string;
  setIsWithdrawModalOpen: (open: boolean) => void;
  loadDashboardData?: () => void | Promise<void>;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  walletBalance,
  transactions,
  formatVND,
  setIsWithdrawModalOpen,
  loadDashboardData
}) => {
  const [depositAmount, setDepositAmount] = useState<string>('2000000');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  // Pagination states (5 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil((transactions?.length || 0) / ITEMS_PER_PAGE);
  const paginatedTransactions = (transactions || []).slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
      return;
    }

    try {
      setIsDepositing(true);
      const res = await axiosClient.post('/tutors/wallet/deposit', { amount });
      toast.success(res.data.message || 'Nạp tiền vào ví thành công!');
      if (loadDashboardData) {
        await loadDashboardData();
      }
    } catch (err: any) {
      console.error('Error depositing to wallet:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền.');
    } finally {
      setIsDepositing(false);
    }
  };

  const setQuickAmount = (val: number) => {
    setDepositAmount(val.toString());
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        
        {/* WALLET CARD INFO */}
        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="wallet-card" style={{ height: '100%', minHeight: '140px', boxSizing: 'border-box' }}>
            <div className="wallet-details">
              <span className="wallet-label">Số dư ví khả dụng (VND)</span>
              <span className="wallet-balance">{formatVND(walletBalance)}</span>
            </div>
            <button 
              className="btn-primary-db" 
              style={{ background: 'white', color: '#1e1b4b', boxShadow: 'none' }} 
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              Yêu cầu rút tiền
            </button>
          </div>
        </div>

        {/* DEPOSIT FORM MOCK */}
        <div id="wallet-deposit-section" className="section-card" style={{ transition: 'all 0.3s ease' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0', color: 'var(--text-dark)' }}>
            <DollarSign color="#10b981" size={20} />
            Nạp tiền vào ví giả lập (Mock Deposit)
          </h3>
          <form onSubmit={handleDeposit}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="number"
                  placeholder="Nhập số tiền nạp..."
                  value={depositAmount}
                  disabled={isDepositing}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isDepositing}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: isDepositing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                }}
              >
                {isDepositing ? <RefreshCw className="animate-spin" size={16} /> : null}
                {isDepositing ? 'Đang nạp...' : 'Nạp tiền'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setQuickAmount(500000)}
                style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                +500K
              </button>
              <button 
                type="button" 
                onClick={() => setQuickAmount(1000000)}
                style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                +1M
              </button>
              <button 
                type="button" 
                onClick={() => setQuickAmount(2000000)}
                style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                +2M
              </button>
              <button 
                type="button" 
                onClick={() => setQuickAmount(5000000)}
                style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
              >
                +5M
              </button>
            </div>
          </form>
        </div>

      </div>

      <div className="section-card">
        <div className="section-header">
          <h2>Lịch sử biến động số dư tài khoản</h2>
        </div>

        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Loại giao dịch</th>
                <th>Số tiền</th>
                <th>Nội dung chi tiết</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx: any) => {
                const isDeposit = tx.type === 'earning' || tx.description?.toLowerCase().includes('nạp tiền') || tx.description?.toLowerCase().includes('hoàn');
                const isSuccessful = tx.status === 'success' || tx.status === 'refunded';
                return (
                  <tr key={tx.transaction_id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.transaction_id.slice(0, 10)}</td>
                    <td>
                      <span style={{
                        color: isDeposit ? '#059669' : '#dc2626',
                        fontWeight: 600
                      }}>
                        {isDeposit ? '+ Thu nhập / Nạp tiền' : '- Phí / Rút tiền'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {isDeposit ? '+' : '-'}{formatVND(Number(tx.amount))}
                    </td>
                    <td>{tx.description}</td>
                    <td>{new Date(tx.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <span className={`badge badge-${isSuccessful ? 'confirmed' : (tx.status === 'pending' ? 'pending' : 'draft')}`}>
                        {isSuccessful ? 'Thành công' : (tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại')}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                    Chưa phát sinh giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                color: currentPage === 1 ? '#94a3b8' : '#334155',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              }}
            >
              <ChevronLeft size={16} /> Trang trước
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: page === currentPage ? 'none' : '1px solid #cbd5e1',
                  background: page === currentPage ? '#6366f1' : '#ffffff',
                  color: page === currentPage ? '#ffffff' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.85rem',
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                color: currentPage === totalPages ? '#94a3b8' : '#334155',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.15s ease'
              }}
            >
              Trang sau <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
