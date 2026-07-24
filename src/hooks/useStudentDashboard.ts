import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const useStudentDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Dashboard states
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [favoriteTutors, setFavoriteTutors] = useState<FavoriteTutor[]>([]);

  // Form states for profile edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formGrade, setFormGrade] = useState('');
  const [formGoals, setFormGoals] = useState('');
  const [formSubjects, setFormSubjects] = useState<string[]>([]);
  const [formMode, setFormMode] = useState<'online' | 'offline' | 'both'>('both');
  const [formBudgetMax, setFormBudgetMax] = useState<number>(1000000);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

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
            fullName: dbUser.full_name,
            email: dbUser.email,
            phone: dbUser.phone || '',
            avatar: dbUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            grade_level: dbUser.metadata?.grade_level || 'Lớp 11',
            learning_goals: dbUser.metadata?.learning_goals || 'Chưa thiết lập mục tiêu.',
            preferred_subjects: dbUser.metadata?.preferred_subjects || [],
            preferred_mode: dbUser.metadata?.preferred_mode || 'both',
            budget_min: Number(dbUser.metadata?.budget_min) || 0,
            budget_max: Number(dbUser.metadata?.budget_max) || 1000000,
            joinedAt: dbUser.created_at
          };
          setProfile(mappedProfile);
          setFormName(mappedProfile.fullName);
          setFormPhone(mappedProfile.phone);
          setFormGrade(mappedProfile.grade_level);
          setFormGoals(mappedProfile.learning_goals);
          setFormSubjects(mappedProfile.preferred_subjects);
          setFormMode(mappedProfile.preferred_mode);
          setFormBudgetMax(mappedProfile.budget_max);
        }

        // Helper mapper functions for bookings
        const mapBookingToEnrolledCourse = (b: any): EnrolledCourse => {
          return {
            course_id: b.course?.course_id || '',
            title: b.course?.title || 'Khóa học',
            subject: b.course?.subject || 'Môn học',
            instructor: b.course?.tutor?.user?.full_name || 'Giảng viên',
            thumbnail: b.course?.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
            progress: b.status === 'completed' ? 100 : 50,
            completedLessons: b.status === 'completed' ? (b.course?.total_sessions || 1) : 0,
            totalLessons: b.course?.total_sessions || 1,
            nextSessionTime: b.schedule?.start_time || undefined
          };
        };

        const mapBookingToClassSession = (b: any): ClassSession => {
          return {
            session_id: b.booking_id,
            courseTitle: b.course?.title || 'Khóa học',
            tutorName: b.course?.tutor?.user?.full_name || 'Giảng viên',
            tutorAvatar: b.course?.tutor?.user?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            startTime: b.schedule?.start_time || new Date().toISOString(),
            endTime: b.schedule?.end_time || new Date().toISOString(),
            status: b.status === 'confirmed' ? 'scheduled' : (b.status === 'completed' ? 'completed' : 'cancelled'),
            meetingLink: `https://meet.jit.si/novalearn-${b.booking_id}`
          };
        };

        // 2. Fetch Bookings (for Enrolled Courses & Class Sessions)
        const bookingsRes = await bookingApi.getMyBookings();
        if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
          const mappedCourses = bookingsRes.data.map(mapBookingToEnrolledCourse);
          setEnrolledCourses(mappedCourses);

          const mappedSessions = bookingsRes.data.map(mapBookingToClassSession);
          setClassSessions(mappedSessions);
        }

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
              name: fav.tutor?.user?.full_name || 'Giảng viên',
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
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Có lỗi xảy ra khi tải thông tin bảng điều khiển.');
      }
    };

    fetchDashboardData();
  }, [navigate]);

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
        metadata: {
          grade_level: formGrade,
          learning_goals: formGoals,
          preferred_subjects: formSubjects,
          preferred_mode: formMode,
          budget_max: formBudgetMax
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
          avatar: newAvatar,
          grade_level: formGrade,
          learning_goals: formGoals,
          preferred_subjects: formSubjects,
          preferred_mode: formMode,
          budget_max: formBudgetMax
        };

        setProfile(updatedProfile);
        authStorage.setAuthSession(undefined, undefined, formName);
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

  // Toggle Subject checkbox
  const handleSubjectCheckbox = (subject: string) => {
    if (formSubjects.includes(subject)) {
      setFormSubjects(formSubjects.filter(s => s !== subject));
    } else {
      setFormSubjects([...formSubjects, subject]);
    }
  };

  // Remove tutor from favorites
  const handleRemoveFavorite = async (tutorId: string) => {
    try {
      const res = await favoriteApi.toggleFavorite(tutorId);
      if (res && res.success) {
        setFavoriteTutors(prev => prev.filter(t => t.tutor_id !== tutorId));
        toast.info('Đã xóa giảng viên khỏi danh sách yêu thích.');
      } else {
        toast.error(res?.error || 'Không thể xóa giảng viên khỏi danh sách yêu thích.');
      }
    } catch (err: any) {
      console.error('Error removing favorite tutor:', err);
      toast.error('Có lỗi xảy ra khi xóa giảng viên yêu thích.');
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

  // Format date helper
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
    formState: {
      formName,
      formPhone,
      formGrade,
      formGoals,
      formSubjects,
      formMode,
      formBudgetMax
    },
    formSetters: {
      setFormName,
      setFormPhone,
      setFormGrade,
      setFormGoals,
      setFormSubjects,
      setFormMode,
      setFormBudgetMax
    },
    handlers: {
      handleProfileSubmit,
      handleSubjectCheckbox,
      handleRemoveFavorite,
      handleSimulateQuiz,
      handleLogout,
      handleAvatarFileChange
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
