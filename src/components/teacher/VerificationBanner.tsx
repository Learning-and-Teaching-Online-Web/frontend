import React from 'react';
import { Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface VerificationBannerProps {
  status?: 'pending' | 'approved' | 'rejected' | string;
  onGoToProfile?: () => void;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({
  status = 'pending',
  onGoToProfile
}) => {
  if (status === 'approved') {
    return (
      <div className="verification-banner approved">
        <div className="banner-left">
          <div className="banner-icon approved">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="banner-title approved">
              Tài khoản Giảng viên Đối tác Đã Xác Thực
              <span className="banner-tag approved">CHÍNH THỨC</span>
            </div>
            <div className="banner-desc approved">
              Hồ sơ và bằng cấp chuyên môn của bạn đã được kiểm duyệt hợp lệ. Khóa học của bạn sẽ hiển thị ưu tiên tới học viên.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="verification-banner rejected">
        <div className="banner-left">
          <div className="banner-icon rejected">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="banner-title rejected">
              Hồ sơ Xét duyệt Chưa Đạt Yêu Cầu
            </div>
            <div className="banner-desc rejected">
              Admin đã từ chối hồ sơ của bạn. Vui lòng cập nhật lại tiểu sử hoặc tải lên bổ sung các chứng chỉ/bằng cấp hợp lệ để yêu cầu duyệt lại.
            </div>
          </div>
        </div>
        {onGoToProfile && (
          <button onClick={onGoToProfile} className="banner-btn rejected">
            Cập nhật ngay <ArrowRight size={14} />
          </button>
        )}
      </div>
    );
  }

  // Default: pending
  return (
    <div className="verification-banner pending">
      <div className="banner-left">
        <div className="banner-icon pending">
          <Clock size={22} />
        </div>
        <div>
          <div className="banner-title pending">
            Hồ sơ Đang Chờ Admin Xét Duyệt
            <span className="banner-tag pending">PENDING</span>
          </div>
          <div className="banner-desc pending">
            Để tài khoản được kích hoạt chính thức, vui lòng bổ sung đầy đủ Tiểu sử, Kinh nghiệm và gửi Chứng chỉ / Bằng cấp chuyên môn của bạn.
          </div>
        </div>
      </div>
      {onGoToProfile && (
        <button onClick={onGoToProfile} className="banner-btn pending">
          Cập nhật Hồ sơ <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};
