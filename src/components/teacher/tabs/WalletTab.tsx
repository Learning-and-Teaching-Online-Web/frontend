import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosClient from '../../../services/axiosClient';
import { DollarSign, RefreshCw } from 'lucide-react';

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
              {transactions.map((tx: any) => {
                const isDeposit = tx.type === 'earning' || tx.description?.toLowerCase().includes('nạp tiền');
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
                      <span className={`badge badge-${tx.status === 'success' ? 'confirmed' : (tx.status === 'pending' ? 'pending' : 'draft')}`}>
                        {tx.status === 'success' ? 'Thành công' : (tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại')}
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
      </div>
    </div>
  );
};
