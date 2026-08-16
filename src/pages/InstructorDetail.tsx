import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Heart, ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { tutorApi } from '../services/tutorApi';
import { favoriteApi } from '../services/favoriteApi';
import authStorage from '../utils/authStorage';
import { formatMoneyString } from '../utils/formatters';
import '../styles/InstructorDetail.css';

const InstructorDetail: React.FC = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState<any>(null);
  const [otherTutors, setOtherTutors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const isAuthenticated = authStorage.isAuthenticated();
  const userRole = authStorage.getUserRole();
  const isTutorOrAdmin = userRole === 'tutor' || userRole === 'admin';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchTutorDetail = async () => {
      if (!tutorId) return;
      try {
        setIsLoading(true);
        const res = await tutorApi.getById(tutorId);
        if (res && res.success && res.data) {
          setTutor(res.data);
        } else {
          toast.error('Không tìm thấy thông tin gia sư.');
        }
      } catch (err) {
        console.error('Error fetching tutor detail:', err);
        toast.error('Có lỗi xảy ra khi tải hồ sơ gia sư.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOtherTutors = async () => {
      try {
        const res = await tutorApi.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          const filtered = res.data.filter((t: any) => t.tutor_id !== tutorId);
          setOtherTutors(filtered);
        }
      } catch (err) {
        console.error('Error fetching other tutors:', err);
      }
    };

    const checkFavorite = async () => {
      if (!isAuthenticated || isTutorOrAdmin || !tutorId) return;
      try {
        const res = await favoriteApi.getMyFavorites();
        if (res && res.success && Array.isArray(res.data)) {
          const isFav = res.data.some((fav: any) => fav.tutor?.tutor_id === tutorId);
          setIsFavorite(isFav);
        }
      } catch (err) {
        console.error('Error checking favorite:', err);
      }
    };

    fetchTutorDetail();
    fetchOtherTutors();
    checkFavorite();
  }, [tutorId, isAuthenticated, isTutorOrAdmin]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.warning('Bạn cần đăng nhập với tài khoản Học viên để lưu gia sư yêu thích.');
      return;
    }
    if (isTutorOrAdmin) {
      toast.error('Chỉ tài khoản Học viên mới có thể lưu gia sư yêu thích.');
      return;
    }
    if (!tutor) return;

    try {
      const res = await favoriteApi.toggleFavorite(tutor.tutor_id);
      if (res && res.success) {
        if (isFavorite) {
          setIsFavorite(false);
          toast.info(`Đã xóa gia sư khỏi danh sách yêu thích.`);
        } else {
          setIsFavorite(true);
          toast.success(`Đã thêm gia sư vào danh sách yêu thích! ❤️`);
        }
      } else {
        toast.error(res?.error || 'Không thể thực hiện thao tác.');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu gia sư yêu thích.');
    }
  };

  const handleSelectTutor = () => {
    if (!tutor) return;
    const code = tutor.tutor_code || tutor.tutor_id.substring(0, 6);
    toast.info(`Đang chuyển tới form đăng ký tìm gia sư cho Mã GS: ${code}`);
    navigate(`/tim-gia-su?tutor_id=${tutor.tutor_id}`);
  };

  if (isLoading) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-loading">
          <div className="tutor-loading-spinner" />
          <p>Đang tải hồ sơ gia sư...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="tutor-detail-page">
        <div className="container tutor-detail-empty">
          <h2>Không tìm thấy thông tin Gia sư</h2>
          <p>Gia sư có thể đã bị ngưng hoạt động hoặc đường dẫn không tồn tại.</p>
          <Link to="/instructors" className="tutor-back-btn">
            <ChevronLeft size={18} /> Quay lại danh sách Gia sư
          </Link>
        </div>
      </div>
    );
  }

  const name = tutor.full_name || tutor.user?.full_name || tutor.user?.email?.split('@')[0] || 'Gia sư';
  const avatar = tutor.avatar_url || tutor.user?.avatar_url;
  const tutorCode = tutor.tutor_code || `${tutor.tutor_id.substring(0, 6).toUpperCase()}`;

  // Process Date of Birth
  let formattedDob = '';
  if (tutor.date_of_birth) {
    const d = new Date(tutor.date_of_birth);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      formattedDob = `${day}/${month}/${year}`;
    }
  }

  // Process Grades Taught
  let gradesListText = 'Chưa cập nhật';
  if (Array.isArray(tutor.grades) && tutor.grades.length > 0) {
    const list = tutor.grades.map((g: any) => g.grade?.name || g.name || g).filter(Boolean);
    if (list.length > 0) gradesListText = list.join(', ');
  }

  // Process Certificates Text (No File Links, Just Text)
  let certsText = '';
  if (Array.isArray(tutor.certificates) && tutor.certificates.length > 0) {
    certsText = tutor.certificates.map((c: any) => c.title).filter(Boolean).join('; ');
  }

  // Combine info text
  const otherInfoText = [
    tutor.bio,
    certsText ? `Bằng cấp/Chứng chỉ: ${certsText}` : null
  ].filter(Boolean).join('. ');

  // Offline classes
  const offlineClasses = Array.isArray(tutor.offline_classes) ? tutor.offline_classes : [];
  // Online / Video courses
  const coursesList = Array.isArray(tutor.courses) ? tutor.courses : [];

  return (
    <div className="tutor-detail-page">
      {/* Top Banner Navigation */}
      <div className="tutor-detail-top-nav">
        <div className="container">
          <button onClick={() => navigate('/instructors')} className="tutor-nav-back">
            <ChevronLeft size={18} /> Danh sách Gia sư
          </button>
        </div>
      </div>

      <div className="container tutor-detail-content-wrapper">
        {/* Main Box - THÔNG TIN GIA SƯ */}
        <div className="tutor-profile-box">
          {/* Action Buttons Top Right */}
          <div className="tutor-top-action-bar">
            <button className="btn-tutor-status">Kết thúc</button>
            {!isTutorOrAdmin && (
              <button
                className="btn-tutor-favorite"
                onClick={handleToggleFavorite}
                title={isFavorite ? "Bỏ yêu thích gia sư" : "Yêu thích gia sư"}
                style={{
                  background: isFavorite ? '#fef2f2' : '#ffffff',
                  color: isFavorite ? '#ef4444' : '#64748b',
                  border: '1px solid ' + (isFavorite ? '#fca5a5' : '#cbd5e1'),
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} color={isFavorite ? '#ef4444' : '#64748b'} />
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
            )}
            <button className="btn-tutor-select" onClick={handleSelectTutor}>Chọn</button>
          </div>

          <div className="tutor-profile-header">
            {/* Avatar Left */}
            <div className="tutor-profile-avatar-wrapper">
              {avatar ? (
                <img src={avatar} alt={name} className="tutor-profile-avatar-img" />
              ) : (
                <div className="tutor-profile-avatar-placeholder">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Profile Info Right */}
            <div className="tutor-profile-info-fields">
              <div className="tutor-field-row font-bold">
                <span className="field-title">Mã số:</span>
                <span className="field-value highlight-code">{tutorCode}</span>
              </div>

              <div className="tutor-field-row margin-top-sm">
                <span className="field-title">Tên gia sư:</span>
                <span className="field-value font-bold">{name}</span>
              </div>

              {formattedDob && (
                <div className="tutor-field-row">
                  <span className="field-title">Năm sinh:</span>
                  <span className="field-value">{formattedDob}</span>
                </div>
              )}

              <div className="tutor-field-row">
                <span className="field-title">Hiện là:</span>
                <span className="field-value">{tutor.current_role || 'Chưa cập nhật'}</span>
              </div>

              <div className="tutor-field-row">
                <span className="field-title">Trường:</span>
                <span className="field-value">{tutor.university || 'Chưa cập nhật'}</span>
              </div>

              <div className="tutor-field-row">
                <span className="field-title">Chuyên ngành:</span>
                <span className="field-value">{tutor.major || 'Chưa cập nhật'}</span>
              </div>

              {tutor.graduation_year && (
                <div className="tutor-field-row">
                  <span className="field-title">Năm TN:</span>
                  <span className="field-value">{tutor.graduation_year}</span>
                </div>
              )}

              <div className="tutor-field-row">
                <span className="field-title">Nhận dạy:</span>
                <span className="field-value">{gradesListText}</span>
              </div>

              {tutor.subjects_text && (
                <div className="tutor-field-row">
                  <span className="field-title">Các môn:</span>
                  <span className="field-value">{tutor.subjects_text}</span>
                </div>
              )}

              <div className="tutor-field-row">
                <span className="field-title">Khu vực:</span>
                <span className="field-value">
                  {tutor.current_address || tutor.hometown || 'Chưa cập nhật'}
                </span>
              </div>

              <div className="tutor-field-row">
                <span className="field-title">Yêu cầu lương tối thiểu:</span>
                <span className="field-value font-bold text-dark">
                  {formatMoneyString(tutor.min_salary_requirement)}
                </span>
              </div>

              <div className="tutor-field-row">
                <span className="field-title">Thông tin khác:</span>
                <span className="field-value">
                  {otherInfoText || 'Chưa có thông tin bổ sung.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: DANH SÁCH CÁC LỚP ĐĂNG KÝ DẠY (Các Lớp Offline) */}
        <div className="tutor-section-container">
          <h2 className="tutor-section-title green-title">
            DANH SÁCH CÁC LỚP ĐĂNG KÝ DẠY
          </h2>

          <div className="table-responsive">
            <table className="offline-classes-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>MS</th>
                  <th>Lớp / Môn / Thời gian</th>
                  <th style={{ width: '220px' }}>Quận / Huyện / Tỉnh</th>
                  <th style={{ width: '80px' }}>Maps</th>
                  <th style={{ width: '130px' }}>Người thuê</th>
                </tr>
              </thead>
              <tbody>
                {offlineClasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted" style={{ padding: '24px', color: '#64748b', fontStyle: 'italic' }}>
                      Gia sư chưa đăng ký / chưa được giao lớp dạy offline nào.
                    </td>
                  </tr>
                ) : (
                  offlineClasses.map((item: any) => {
                    const gradeName = item.grade?.name || '';
                    const subjectName = item.subject_name || '';
                    const classTitle = [gradeName, subjectName].filter(Boolean).join(', ');
                    const locationParts = [item.address_detail, item.district, item.province].filter(Boolean).join(', ');

                    return (
                      <tr key={item.request_id}>
                        <td className="text-center font-bold">{item.code || item.request_id.substring(0, 5)}</td>
                        <td>
                          <span className="class-name">{classTitle || 'Lớp dạy'}</span>
                          {item.study_time && <>, <i className="class-schedule">{item.study_time}</i></>}
                        </td>
                        <td className="location-text">{locationParts || 'Chưa cập nhật địa điểm'}</td>
                        <td className="text-center">
                          <MapPin size={20} color="#e11d48" className="map-icon" />
                        </td>
                        <td className="text-center">
                          {item.student?.avatar_url ? (
                            <img src={item.student.avatar_url} alt={item.student_name || 'Học viên'} className="student-small-avatar" />
                          ) : item.student_name ? (
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{item.student_name}</div>
                          ) : (
                            <div className="no-image-placeholder">NO IMAGE AVAILABLE</div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: DANH SÁCH CÁC KHÓA HỌC (Các Khóa Online & Video) */}
        <div className="tutor-section-container">
          <h2 className="tutor-section-title blue-title">
            DANH SÁCH CÁC KHÓA HỌC (ONLINE & VIDEO)
          </h2>

          {coursesList.length === 0 ? (
            <div className="online-courses-empty">
              <p>Gia sư chưa phát hành khóa học trực tuyến/video nào. Bạn có thể chọn thuê gia sư dạy kèm trực tiếp ở trên!</p>
            </div>
          ) : (
            <div className="online-courses-grid">
              {coursesList.map((course: any) => (
                <div key={course.course_id} className="online-course-card">
                  <div className="course-type-badge">
                    {course.type === 'video' ? 'Khóa Video Tự Học' : 'Khóa Trực Tuyến Live'}
                  </div>
                  <h3 className="online-course-title">{course.title}</h3>
                  <div className="online-course-info">
                    <span>{course.total_sessions || 10} buổi</span>
                    <span>•</span>
                    <span>{course.duration_minutes || 90} phút/buổi</span>
                  </div>
                  <div className="online-course-price-row">
                    <span className="online-course-price">
                      {Number(course.price).toLocaleString('vi-VN')} VNĐ
                    </span>
                    <Link to={`/courses/${course.course_id}`} className="btn-view-course">
                      Xem khóa học <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 3: GIA SƯ KHÁC */}
        <div className="tutor-section-container">
          <div className="other-tutors-header-banner">
            GIA SƯ KHÁC
          </div>

          <div className="other-tutors-grid">
            {otherTutors.length === 0 ? (
              <p className="text-center text-muted">Đang cập nhật danh sách gia sư khác...</p>
            ) : (
              otherTutors.map((other) => {
                const otherName = other.full_name || other.user?.full_name || 'Gia sư';
                const otherAvatar = other.avatar_url || other.user?.avatar_url;
                const otherCode = other.tutor_code || `${other.tutor_id.substring(0, 5).toUpperCase()}`;

                return (
                  <div key={other.tutor_id} className="other-tutor-card">
                    <div className="other-tutor-card-inner">
                      <div className="other-tutor-avatar-box">
                        {otherAvatar ? (
                          <img src={otherAvatar} alt={otherName} className="other-tutor-avatar" />
                        ) : (
                          <div className="other-tutor-placeholder">
                            {otherName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="other-tutor-details">
                        <div className="other-tutor-code">Mã số: <strong>{otherCode}</strong></div>
                        <h4 className="other-tutor-name">Tên gia sư: {otherName}</h4>
                        <div className="other-tutor-row">Hiện là: {other.current_role || 'Cử Nhân'}</div>
                        <div className="other-tutor-row">Trường: {other.university || 'Đại học'}</div>
                        <div className="other-tutor-row">Chuyên ngành: {other.major || 'Sư phạm'}</div>
                        <div className="other-tutor-row">
                          Yêu cầu lương: <span className="price-tag">{formatMoneyString(other.min_salary_requirement, '250.000 VNĐ')}</span>
                        </div>
                        <Link to={`/instructors/${other.tutor_id}`} className="btn-view-other-profile">
                          Xem hồ sơ chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
