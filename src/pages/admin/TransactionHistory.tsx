import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../services/adminApi';
import { CreditCard, DollarSign, ArrowDownLeft, ArrowUpRight, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface TransactionItem {
  transaction_id: string;
  booking_id: string;
  amount: string;
  payment_method: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  booking: {
    course: {
      title: string;
    };
  };
}

interface PayoutItem {
  payout_id: string;
  tutor_id: string;
  amount: string;
  bank_name: string | null;
  bank_account: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  tutor: {
    user: {
      full_name: string;
      email: string;
    };
  };
}

const TransactionHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>('transactions');
  
  // Transactions states
  const [txs, setTxs] = useState<TransactionItem[]>([]);
  const [txsTotal, setTxsTotal] = useState(0);
  const [txsPage, setTxsPage] = useState(1);
  const [txsLoading, setTxsLoading] = useState(true);

  // Payouts states
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [payoutsTotal, setPayoutsTotal] = useState(0);
  const [payoutsPage, setPayoutsPage] = useState(1);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState('pending');
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  const fetchTransactions = async () => {
    setTxsLoading(true);
    try {
      const response = await adminApi.getTransactions({ page: txsPage, limit: 10 });
      if (response.success) {
        setTxs(response.transactions);
        setTxsTotal(response.total);
      } else {
        toast.error('Lấy lịch sử giao dịch thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối lịch sử giao dịch.');
    } finally {
      setTxsLoading(false);
    }
  };

  const fetchPayouts = async () => {
    setPayoutsLoading(true);
    try {
      const response = await adminApi.getPayouts({
        status: payoutStatusFilter || undefined,
        page: payoutsPage,
        limit: 10
      });
      if (response.success) {
        setPayouts(response.payouts);
        setPayoutsTotal(response.total);
      } else {
        toast.error('Lấy danh sách yêu cầu rút tiền thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối rút tiền.');
    } finally {
      setPayoutsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchPayouts();
    }
  }, [activeTab, txsPage, payoutsPage, payoutStatusFilter]);

  const handleUpdatePayoutStatus = async (payoutId: string, status: 'completed' | 'failed') => {
    try {
      const response = await adminApi.updatePayoutStatus(payoutId, status);
      if (response.success) {
        toast.success(status === 'completed' ? 'Phê duyệt rút tiền thành công!' : 'Từ chối rút tiền thành công (đã hoàn lại số dư cho gia sư)!');
        fetchPayouts();
      } else {
        toast.error(response.error || 'Lỗi xử lý yêu cầu.');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống.');
    }
  };

  const formatPrice = (value: string | number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));
  };

  return (
    <AdminLayout title="Đối soát & Giao dịch tài chính">
      {/* Tabs */}
      <div className="auth-tabs" style={{ maxWidth: '400px', marginBottom: '24px' }}>
        <button 
          className={`auth-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => { setActiveTab('transactions'); setPayoutsPage(1); }}
        >
          Lịch sử giao dịch
        </button>
        <button 
          className={`auth-tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('payouts'); setTxsPage(1); }}
        >
          Yêu cầu rút tiền
        </button>
      </div>

      {activeTab === 'transactions' ? (
        /* TRANSACTIONS TAB */
        <div className="admin-card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="var(--admin-primary)" />
            <span>Lịch sử thanh toán học phí</span>
          </h2>

          {txsLoading ? (
            <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải lịch sử giao dịch...</div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã giao dịch</th>
                    <th>Học viên</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Phương thức</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {txs && txs.length > 0 ? (
                    txs.map((tx) => (
                      <tr key={tx.transaction_id}>
                        <td style={{ fontSize: '12px', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                          {tx.transaction_id.slice(0, 8)}...
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{tx.user?.full_name}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{tx.user?.email}</span>
                        </td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx.booking?.course?.title || 'Đăng ký lớp học'}
                        </td>
                        <td style={{ color: '#34d399', fontWeight: 600 }}>
                          <ArrowDownLeft size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {formatPrice(tx.amount)}
                        </td>
                        <td style={{ textTransform: 'uppercase', fontSize: '12px' }}>{tx.payment_method}</td>
                        <td>
                          <span className={`admin-badge ${tx.status === 'success' ? 'success' : tx.status === 'failed' ? 'danger' : 'warning'}`}>
                            {tx.status === 'success' ? 'Thành công' : tx.status === 'failed' ? 'Thất bại' : 'Chờ xử lý'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                          {new Date(tx.created_at).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                        Chưa có giao dịch thanh toán nào được thực hiện.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {Math.ceil(txsTotal / 10) > 1 && (
            <div className="admin-pagination">
              <button disabled={txsPage === 1} onClick={() => setTxsPage(p => Math.max(p - 1, 1))} className="admin-page-btn">
                Trang trước
              </button>
              <span className="admin-page-info">Trang {txsPage} / {Math.ceil(txsTotal / 10)}</span>
              <button disabled={txsPage === Math.ceil(txsTotal / 10)} onClick={() => setTxsPage(p => Math.min(p + 1, Math.ceil(txsTotal / 10)))} className="admin-page-btn">
                Trang sau
              </button>
            </div>
          )}
        </div>
      ) : (
        /* PAYOUTS TAB */
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="var(--admin-warning)" />
              <span>Yêu cầu rút tiền của Gia sư</span>
            </h2>

            <select
              className="admin-select-filter"
              value={payoutStatusFilter}
              onChange={(e) => { setPayoutStatusFilter(e.target.value); setPayoutsPage(1); }}
            >
              <option value="pending">Chờ phê duyệt</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="failed">Bị từ chối</option>
              <option value="">Tất cả trạng thái</option>
            </select>
          </div>

          {payoutsLoading ? (
            <div style={{ color: 'var(--admin-text-muted)' }}>Đang tải danh sách yêu cầu...</div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Gia sư</th>
                    <th>Thông tin ngân hàng</th>
                    <th>Số tiền rút</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts && payouts.length > 0 ? (
                    payouts.map((po) => (
                      <tr key={po.payout_id}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{po.tutor?.user?.full_name}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{po.tutor?.user?.email}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 550, display: 'block' }}>{po.bank_name || 'N/A'}</span>
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>STK: {po.bank_account || 'N/A'}</span>
                        </td>
                        <td style={{ color: '#f59e0b', fontWeight: 600 }}>
                          <ArrowUpRight size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {formatPrice(po.amount)}
                        </td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                          {new Date(po.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <span className={`admin-badge ${po.status === 'completed' ? 'success' : po.status === 'failed' ? 'danger' : 'warning'}`}>
                            {po.status === 'completed' ? 'Thành công' : po.status === 'failed' ? 'Từ chối' : 'Chờ duyệt'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                            {po.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdatePayoutStatus(po.payout_id, 'completed')} 
                                  className="admin-btn sm success"
                                  title="Chuyển tiền thành công"
                                >
                                  <Check size={14} />
                                  <span>Duyệt chi</span>
                                </button>
                                <button 
                                  onClick={() => handleUpdatePayoutStatus(po.payout_id, 'failed')} 
                                  className="admin-btn sm danger"
                                  title="Từ chối yêu cầu và hoàn tiền"
                                >
                                  <X size={14} />
                                  <span>Từ chối</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                        Không có yêu cầu rút tiền nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {Math.ceil(payoutsTotal / 10) > 1 && (
            <div className="admin-pagination">
              <button disabled={payoutsPage === 1} onClick={() => setPayoutsPage(p => Math.max(p - 1, 1))} className="admin-page-btn">
                Trang trước
              </button>
              <span className="admin-page-info">Trang {payoutsPage} / {Math.ceil(payoutsTotal / 10)}</span>
              <button disabled={payoutsPage === Math.ceil(payoutsTotal / 10)} onClick={() => setPayoutsPage(p => Math.min(p + 1, Math.ceil(payoutsTotal / 10)))} className="admin-page-btn">
                Trang sau
              </button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default TransactionHistory;
