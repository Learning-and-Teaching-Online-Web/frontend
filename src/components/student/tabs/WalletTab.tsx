import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

interface WalletTabProps {
  balance: number;
  transactions: any[];
  onDeposit: (amount: number) => Promise<boolean>;
  formatDate: (isoString: string) => string;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  balance,
  transactions,
  onDeposit,
  formatDate
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(300000);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      toast.error('Số tiền nạp phải lớn hơn 0đ.');
      return;
    }
    try {
      setIsSubmitting(true);
      const success = await onDeposit(depositAmount);
      if (success) {
        toast.success(`Đã nạp thành công ${formatPrice(depositAmount)} vào ví giả lập!`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Nạp tiền thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Ví cá nhân & Thanh toán</h2>
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Quản lý số dư, nạp tiền và thực hiện thanh toán học phí</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' }}>
        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '14px', opacity: 0.85, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số dư ví hiện tại</span>
            <h3 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 0 0', color: 'white', fontFamily: 'var(--outfit)' }}>{formatPrice(balance)}</h3>
            <span style={{ fontSize: '12px', opacity: 0.75, display: 'block', marginTop: '12px' }}>Đơn vị tiền tệ: VND (Việt Nam Đồng)</span>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={32} color="#ffffff" />
          </div>
        </div>

        {/* Deposit Form */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="var(--primary)" />
            <span>Nạp tiền giả lập vào ví</span>
          </h3>

          <form onSubmit={handleDepositSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Nhập số tiền nạp (VND) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="10000"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '15px',
                    fontWeight: 600
                  }}
                />
                <DollarSign size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Quick Fill Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[100000, 200000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: depositAmount === amt ? 'var(--primary-light)' : 'var(--bg-light)',
                    color: depositAmount === amt ? 'var(--primary)' : 'var(--text-main)',
                    border: `1px solid ${depositAmount === amt ? 'var(--primary)' : 'var(--border)'}`,
                    cursor: 'pointer'
                  }}
                >
                  +{amt.toLocaleString('vi-VN')}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="start-now-btn"
              style={{ padding: '12px', fontSize: '14px', borderRadius: '8px', width: '100%', marginTop: '4px' }}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Lịch sử biến động số dư</h3>
        <div style={{ overflowX: 'auto', background: 'white', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <table className="quiz-list-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Thời gian</th>
                <th>Mô tả hoạt động</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.map((tx: any) => {
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx.transaction_id}>
                      <td style={{ fontSize: '12px', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                        {tx.transaction_id.slice(0, 8)}...
                      </td>
                      <td>{formatDate(tx.created_at)}</td>
                      <td style={{ fontWeight: 550, color: 'var(--text-dark)' }}>{tx.description}</td>
                      <td style={{
                        fontWeight: 700,
                        color: isExpense ? '#f97316' : '#10b981',
                        whiteSpace: 'nowrap'
                      }}>
                        <span style={{ marginRight: '4px' }}>
                          {isExpense ? <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <ArrowDownLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                        </span>
                        {isExpense ? '-' : '+'}{formatPrice(tx.amount)}
                      </td>
                      <td>
                        <span className={tx.status === 'success' ? 'badge-pass' : 'badge-fail'}>
                          {tx.status === 'success' ? 'Thành công' : tx.status === 'failed' ? 'Thất bại' : 'Chờ xử lý'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    Chưa có lịch sử giao dịch ví cá nhân.
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
