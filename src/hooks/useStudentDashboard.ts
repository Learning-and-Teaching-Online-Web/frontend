import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { 
  StudentProfile, 
  EnrolledCourse, 
  ClassSession, 
  QuizAttempt, 
  FavoriteTutor 
} from '../data/mockStudentData';
import { 
  initialStudentProfile
} from '../data/mockStudentData';
import { authApi } from '../services/authApi';
import { bookingApi } from '../services/bookingApi';
import { favoriteApi } from '../services/favoriteApi';
import authStorage from '../utils/authStorage';
import { quizApi } from '../services/quizApi';
import axiosClient from '../services/axiosClient';
import type { StudentClassRequest } from '../components/student/tabs/ClassRequestsTab';

const VALID_STUDENT_TABS = [
  'overview',
  'courses',
  'schedule',
  'class-requests',
  'quizzes',
  'favorites',
  'profile',
  'wallet'
];

export const useStudentDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const tabFromUrl = searchParams.get('tab');
  const activeTab = tabFromUrl && VALID_STUDENT_TABS.includes(tabFromUrl) ? tabFromUrl : 'overview';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Dashboard states
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [favoriteTutors, setFavoriteTutors] = useState<FavoriteTutor[]>([]);
  const [myClassRequests, setMyClassRequests] = useState<StudentClassRequest[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  // Form states for profile edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGender, setFormGender] = useState('male');
  const [formDateOfBirth, setFormDateOfBirth] = useState('');
  const [formGrade, setFormGrade] = useState('Lớp 11');
  const [formAcademicLevel, setFormAcademicLevel] = useState('Khá');
  const [formProvince, setFormProvince] = useState('');
  const [formDistrict, setFormDistrict] = useState('');
  const [formAddressDetail, setFormAddressDetail] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // Helper mapper functions for bookings
  const mapBookingToEnrolledCourse = (b: any): EnrolledCourse => {
    const hasReview = Array.isArray(b.reviews) ? b.reviews.length > 0 : !!b.reviews;
    return {
      course_id: b.course?.course_id || '',
      booking_id: b.booking_id,
      type: b.course?.type || 'online',
      title: b.course?.title || 'Khóa học',
      subject: b.course?.subject || 'Môn học',
      instructor: b.course?.tutor?.user?.full_name || 'Gia sư',
      thumbnail: b.course?.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
      progress: b.status === 'completed' ? 100 : 50,
      completedLessons: b.status === 'completed' ? (b.course?.total_sessions || 1) : 0,
      totalLessons: b.course?.total_sessions || 1,
      nextSessionTime: b.schedule?.start_time || undefined,
      bookingStatus: b.status,
      paymentStatus: b.payment_status,
      isReviewed: hasReview
    };
  };

  const mapBookingToClassSession = (b: any): ClassSession => {
    const hasReview = Array.isArray(b.reviews) ? b.reviews.length > 0 : !!b.reviews;
    return {
      session_id: b.booking_id,
      booking_id: b.booking_id,
      course_id: b.course?.course_id,
      type: b.course?.type || 'online',
      courseTitle: b.course?.title || 'Khóa học',
      tutorName: b.course?.tutor?.user?.full_name || 'Gia sư',
      tutorAvatar: b.course?.tutor?.user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      startTime: b.schedule?.start_time || new Date().toISOString(),
      endTime: b.schedule?.end_time || new Date().toISOString(),
      status: b.status === 'confirmed' ? 'scheduled' : (b.status === 'completed' ? 'completed' : 'cancelled'),
      meetingLink: `https://meet.jit.si/novalearn-${b.booking_id}`,
      bookingStatus: b.status,
      paymentStatus: b.payment_status,
      isReviewed: hasReview
    };
  };

  const fetchWalletData = async () => {
    try {
      const walletRes = await bookingApi.getWallet();
      if (walletRes && walletRes.success && walletRes.data) {
        setWalletBalance(walletRes.data.balance || 0);
        setWalletTransactions(walletRes.data.transactions || []);
      }
    } catch (err) {
      console.error('Error refreshing wallet:', err);
    }
  };

  // Authentication check
  useEffect(() => {
    const authStatus = authStorage.isAuthenticated();
    if (!authStatus) {
      setIsAuthenticated(false);
      toast.warning('Bạn cần đăng nhập để truy cập trang này. Đang chuyển hướng...');
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Load state from backend APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      const authStatus = authStorage.isAuthenticated();
      if (!authStatus) return;

      try {
        // 1. Fetch Profile
        const profileRes = await authApi.getProfile();
        if (profileRes && profileRes.success && profileRes.data) {
          const dbUser = profileRes.data;
          const mappedProfile: StudentProfile = {
            student_id: dbUser.user_id,
            fullName: dbUser.full_name || '',
            email: dbUser.email || '',
            phone: dbUser.phone || '',
            avatar: dbUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            gender: dbUser.gender || 'male',
            date_of_birth: dbUser.date_of_birth ? dbUser.date_of_birth.split('T')[0] : '',
            grade_level: dbUser.metadata?.grade_level || 'Lớp 11',
            academic_level: dbUser.metadata?.academic_level || 'Khá',
            province: dbUser.metadata?.province || '',
            district: dbUser.metadata?.district || '',
            address_detail: dbUser.metadata?.address_detail || '',
            joinedAt: dbUser.created_at
          };
          setProfile(mappedProfile);
          setFormName(mappedProfile.fullName);
          setFormPhone(mappedProfile.phone);
          setFormGender(mappedProfile.gender);
          setFormDateOfBirth(mappedProfile.date_of_birth);
          setFormGrade(mappedProfile.grade_level);
          setFormAcademicLevel(mappedProfile.academic_level);
          setFormProvince(mappedProfile.province);
          setFormDistrict(mappedProfile.district);
          setFormAddressDetail(mappedProfile.address_detail);
        }

        // 2. Fetch Bookings (for Enrolled Courses & Class Sessions)
        const bookingsRes = await bookingApi.getMyBookings();
        if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
          const mappedCourses = bookingsRes.data.map(mapBookingToEnrolledCourse);
          setEnrolledCourses(mappedCourses);

          const mappedSessions = bookingsRes.data.map(mapBookingToClassSession);
          setClassSessions(mappedSessions);
        }

        // Fetch Wallet Data
        await fetchWalletData();

        // 3. Quiz Attempts
        const quizAttemptsRes = await quizApi.getMyAttempts();
        if (quizAttemptsRes && quizAttemptsRes.success && Array.isArray(quizAttemptsRes.data)) {
          const mappedAttempts = quizAttemptsRes.data.map((qa: any): QuizAttempt => ({
            attempt_id: qa.attempt_id,
            quizTitle: qa.quiz?.title || 'Bài kiểm tra',
            courseTitle: qa.quiz?.course?.title || 'Khóa học',
            score: Number(qa.score),
            totalPoints: Number(qa.total_points),
            isPassed: qa.is_passed,
            completedAt: qa.completed_at
          }));
          setQuizAttempts(mappedAttempts);
        } else {
          setQuizAttempts([]);
        }

        // 4. Favorite Tutors
        const favoritesRes = await favoriteApi.getMyFavorites();
        if (favoritesRes && favoritesRes.success && Array.isArray(favoritesRes.data)) {
          const mappedFavorites = favoritesRes.data.map((fav: any): FavoriteTutor => {
            const rawSubjects = fav.tutor?.subjects;
            let subjectStr = 'Chưa cập nhật';
            if (Array.isArray(rawSubjects)) {
              subjectStr = rawSubjects.join(', ');
            } else if (typeof rawSubjects === 'string') {
              try {
                subjectStr = JSON.parse(rawSubjects).join(', ');
              } catch {
                subjectStr = rawSubjects;
              }
            }
            return {
              tutor_id: fav.tutor?.tutor_id || '',
              name: fav.tutor?.user?.full_name || 'Gia sư',
              avatar: fav.tutor?.user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
              subject: subjectStr,
              rating: Number(fav.tutor?.rating) || 5.0,
              reviewCount: Number(fav.tutor?.review_count) || 0,
              hourlyRate: Number(fav.tutor?.hourly_rate) || 0,
              bio: fav.tutor?.bio || 'Chưa cập nhật giới thiệu.'
            };
          });
          setFavoriteTutors(mappedFavorites);
        } else {
          setFavoriteTutors([]);
        }

        // 5. My Offline Class Requests
        try {
          const reqRes = await axiosClient.get('/class-requests/my-requests');
          if (reqRes && reqRes.data && Array.isArray(reqRes.data.data)) {
            setMyClassRequests(reqRes.data.data);
          }
        } catch {
          setMyClassRequests([]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Có lỗi xảy ra khi tải thông tin bảng điều khiển.');
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const fetchMyClassRequests = async () => {
    try {
      const res = await axiosClient.get('/class-requests/my-requests');
      if (res && res.data && Array.isArray(res.data.data)) {
        setMyClassRequests(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching my class requests:', err);
    }
  };

  const handleAvatarFileChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setAvatarBase64(base64Str);
      setProfile(prev => ({ ...prev, avatar: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  // Update Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Họ và tên không được để trống.');
      return;
    }

    try {
      const payload: any = {
        fullName: formName,
        phone: formPhone,
        gender: formGender,
        dateOfBirth: formDateOfBirth,
        metadata: {
          grade_level: formGrade,
          academic_level: formAcademicLevel,
          province: formProvince,
          district: formDistrict,
          address_detail: formAddressDetail
        }
      };

      if (avatarBase64) {
        payload.avatarUrl = avatarBase64;
      }

      const res = await authApi.updateProfile(payload);

      if (res && res.success) {
        const newAvatar = res.data?.avatar_url || avatarBase64 || profile.avatar;
        const updatedProfile: StudentProfile = {
          ...profile,
          fullName: formName,
          phone: formPhone,
          gender: formGender,
          date_of_birth: formDateOfBirth,
          avatar: newAvatar,
          grade_level: formGrade,
          academic_level: formAcademicLevel,
          province: formProvince,
          district: formDistrict,
          address_detail: formAddressDetail
        };

        setProfile(updatedProfile);
        authStorage.updateUserName(formName);
        window.dispatchEvent(new Event('authChange'));
        toast.success('Cập nhật hồ sơ thành công!');
      } else {
        toast.error(res?.error || 'Cập nhật thất bại.');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error(err?.response?.data?.error || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    }
  };

  // Remove tutor from favorites
  const handleRemoveFavorite = async (tutorId: string) => {
    try {
      const res = await favoriteApi.toggleFavorite(tutorId);
      if (res && res.success) {
        setFavoriteTutors(prev => prev.filter(t => t.tutor_id !== tutorId));
        toast.info('Đã xóa gia sư khỏi danh sách yêu thích.');
      } else {
        toast.error(res?.error || 'Không thể xóa gia sư khỏi danh sách yêu thích.');
      }
    } catch (err: any) {
      console.error('Error removing favorite tutor:', err);
      toast.error('Có lỗi xảy ra khi xóa gia sư yêu thích.');
    }
  };

  // Simulate starting a quiz
  const handleSimulateQuiz = (quizTitle: string, courseTitle: string) => {
    const score = Number((Math.random() * 5 + 5).toFixed(1)); // Generate score between 5.0 and 10.0
    const isPassed = score >= 5.0;
    
    const newAttempt: QuizAttempt = {
      attempt_id: `attempt-${Date.now()}`,
      quizTitle,
      courseTitle,
      score,
      totalPoints: 10,
      isPassed,
      completedAt: new Date().toISOString()
    };

    const updated = [newAttempt, ...quizAttempts];
    setQuizAttempts(updated);
    sessionStorage.setItem('studentQuizAttempts', JSON.stringify(updated));
    toast.success(`Hoàn thành bài kiểm tra "${quizTitle}"! Điểm số: ${score}/10`);
  };

  const handleDeposit = async (amount: number) => {
    try {
      const res = await bookingApi.depositWallet(amount);
      if (res && res.success) {
        await fetchWalletData();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error depositing to wallet:', err);
      toast.error(err.response?.data?.error || err.message || 'Nạp tiền thất bại.');
      return false;
    }
  };

  const handlePayBooking = async (bookingId: string) => {
    try {
      const res = await bookingApi.payBooking(bookingId);
      if (res && res.success) {
        await fetchWalletData();
        const bookingsRes = await bookingApi.getMyBookings();
        if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
          const mappedCourses = bookingsRes.data.map(mapBookingToEnrolledCourse);
          setEnrolledCourses(mappedCourses);

          const mappedSessions = bookingsRes.data.map(mapBookingToClassSession);
          setClassSessions(mappedSessions);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error paying for booking:', err);
      toast.error(err.response?.data?.error || err.message || 'Thanh toán thất bại.');
      return false;
    }
  };

  // Helper date-time formatters
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authStorage.clearAuthSession();
    window.dispatchEvent(new Event('authChange'));
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  // Get active session for overview (next scheduled session)
  const nextSession = classSessions.find(s => s.status === 'scheduled');

  // Quiz statistics
  const totalQuizzes = quizAttempts.length;
  const avgQuizScore = totalQuizzes > 0 
    ? (quizAttempts.reduce((sum, q) => sum + q.score, 0) / totalQuizzes).toFixed(1)
    : 'N/A';

  // Compute Total study hours (mocked from class sessions completed)
  const completedSessionsCount = classSessions.filter(s => s.status === 'completed').length;
  const mockStudyHours = completedSessionsCount * 1.5 + 8; // 8 base hours + 1.5 hours per session

  return {
    isAuthenticated,
    activeTab,
    setActiveTab,
    profile,
    enrolledCourses,
    classSessions,
    quizAttempts,
    favoriteTutors,
    myClassRequests,
    fetchMyClassRequests,
    walletBalance,
    walletTransactions,
    formState: {
      formName,
      formPhone,
      formGender,
      formDateOfBirth,
      formGrade,
      formAcademicLevel,
      formProvince,
      formDistrict,
      formAddressDetail
    },
    formSetters: {
      setFormName,
      setFormPhone,
      setFormGender,
      setFormDateOfBirth,
      setFormGrade,
      setFormAcademicLevel,
      setFormProvince,
      setFormDistrict,
      setFormAddressDetail
    },
    handlers: {
      handleProfileSubmit,
      handleRemoveFavorite,
      handleSimulateQuiz,
      handleLogout,
      handleAvatarFileChange,
      handleDeposit,
      handlePayBooking
    },
    helpers: {
      formatDate,
      formatTime
    },
    computed: {
      nextSession,
      avgQuizScore,
      totalQuizzes,
      mockStudyHours
    }
  };
};
