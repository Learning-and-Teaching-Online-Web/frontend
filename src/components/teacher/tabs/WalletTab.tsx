import React from 'react';

interface WalletTabProps {
  walletBalance: number;
  transactions: any[];
  formatVND: (n: number) => string;
  setIsWithdrawModalOpen: (open: boolean) => void;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  walletBalance,
  transactions,
  formatVND,
  setIsWithdrawModalOpen
}) => {
  return (
    <div>
      <div className="section-card" style={{ marginBottom: '25px' }}>
        <div className="wallet-card">
          <div className="wallet-details">
            <span className="wallet-label">Số dư ví khả dụng (VND)</span>
            <span className="wallet-balance">{formatVND(walletBalance)}</span>
          </div>
          <button className="btn-primary-db" style={{ background: 'white', color: '#1e1b4b', boxShadow: 'none' }} onClick={() => setIsWithdrawModalOpen(true)}>
            Yêu cầu rút tiền
          </button>
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
              {transactions.map((tx: any) => (
                <tr key={tx.transaction_id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tx.transaction_id.slice(0, 10)}</td>
                  <td>
                    <span style={{
                      color: tx.type === 'earning' ? '#059669' : '#dc2626',
                      fontWeight: 600
                    }}>
                      {tx.type === 'earning' ? '+ Thu nhập' : '- Rút tiền'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {tx.type === 'earning' ? '+' : '-'}{formatVND(Number(tx.amount))}
                  </td>
                  <td>{tx.description}</td>
                  <td>{new Date(tx.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge badge-${tx.status === 'success' ? 'confirmed' : (tx.status === 'pending' ? 'pending' : 'draft')}`}>
                      {tx.status === 'success' ? 'Thành công' : (tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại')}
                    </span>
                  </td>
                </tr>
              ))}
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
