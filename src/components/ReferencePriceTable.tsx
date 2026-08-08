import React, { useEffect, useState } from 'react';
import axiosClient from '../services/axiosClient';
import { DollarSign, Info } from 'lucide-react';

interface ReferencePrice {
  price_id: string;
  grade_group: string;
  sessions_per_week: number;
  student_tutor_price: string;
  teacher_tutor_price: string;
}

const ReferencePriceTable: React.FC = () => {
  const [prices, setPrices] = useState<ReferencePrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axiosClient.get('/reference-prices');
        if (res.data && res.data.data) {
          setPrices(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching reference prices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);


  const groups = ['LỚP 1, 2, 3, 4', 'LỚP 5, 6, 7, 8', 'LỚP 9, 10, 11, 12', 'LTDH - NGOẠI NGỮ'];

  return (
    <div className="reference-price-container" style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <DollarSign className="text-primary" size={24} style={{ color: '#2563eb' }} />
          BẢNG GIÁ HỌC PHÍ THAM KHẢO
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
          Cam kết giá gia sư công khai đầy đủ - Đảm bảo gia sư dạy tốt chất lượng
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Đang tải bảng giá...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#2563eb', color: '#ffffff' }}>
                <th rowSpan={2} style={{ padding: '12px', border: '1px solid #cbd5e1' }}>KHỐI LỚP</th>
                <th colSpan={2} style={{ padding: '8px', border: '1px solid #cbd5e1' }}>2 buổi / tuần</th>
                <th colSpan={2} style={{ padding: '8px', border: '1px solid #cbd5e1' }}>3 buổi / tuần</th>
                <th colSpan={2} style={{ padding: '8px', border: '1px solid #cbd5e1' }}>4 buổi / tuần</th>
                <th colSpan={2} style={{ padding: '8px', border: '1px solid #cbd5e1' }}>5 buổi / tuần</th>
              </tr>
              <tr style={{ background: '#1d4ed8', color: '#ffffff' }}>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Sinh viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Giáo viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Sinh viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Giáo viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Sinh viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Giáo viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Sinh viên</th>
                <th style={{ padding: '8px', border: '1px solid #cbd5e1' }}>Giáo viên</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, idx) => {
                const groupPrices = prices.filter((p) => p.grade_group === group);
                const p2 = groupPrices.find((p) => p.sessions_per_week === 2);
                const p3 = groupPrices.find((p) => p.sessions_per_week === 3);
                const p4 = groupPrices.find((p) => p.sessions_per_week === 4);
                const p5 = groupPrices.find((p) => p.sessions_per_week === 5);

                return (
                  <tr key={group} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b', border: '1px solid #cbd5e1' }}>{group}</td>
                    
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#2563eb', fontWeight: '500' }}>{p2?.student_tutor_price || '600 - 700'}k</td>
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#dc2626', fontWeight: '500' }}>{p2?.teacher_tutor_price || '1100 - 1300'}k</td>
                    
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#2563eb', fontWeight: '500' }}>{p3?.student_tutor_price || '900 - 1000'}k</td>
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#dc2626', fontWeight: '500' }}>{p3?.teacher_tutor_price || '1500 - 1800'}k</td>

                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#2563eb', fontWeight: '500' }}>{p4?.student_tutor_price || '1100 - 1300'}k</td>
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#dc2626', fontWeight: '500' }}>{p4?.teacher_tutor_price || '1900 - 2300'}k</td>

                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#2563eb', fontWeight: '500' }}>{p5?.student_tutor_price || '1400 - 1600'}k</td>
                    <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#dc2626', fontWeight: '500' }}>{p5?.teacher_tutor_price || '2300 - 2800'}k</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '16px', padding: '14px', background: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #f59e0b', fontSize: '0.85rem', color: '#92400e' }}>
        <p style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={16} /> Lưu ý quan trọng:
        </p>
        <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6 }}>
          <li>Thời gian dạy của <strong>Sinh viên</strong> 1 buổi là <strong>120 phút</strong>; thời gian dạy của <strong>Giáo viên</strong> 1 buổi là <strong>90 phút</strong>. Học phí trên áp dụng cho 1 tháng từ thời điểm gia sư bắt đầu dạy học.</li>
          <li>Học phí sẽ tăng tùy theo số môn học (1 môn học thêm +100.000đ, thêm 1 người học +200.000đ).</li>
          <li>Học phí trên áp dụng cho Sinh viên và Giáo viên có bằng cử nhân của các trường đại học sư phạm hoặc giáo viên đang dạy tại các trường.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencePriceTable;
