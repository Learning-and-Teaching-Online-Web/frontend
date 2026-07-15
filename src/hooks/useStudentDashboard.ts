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
  initialStudentProfile, 
  mockEnrolledCourses, 
  mockClassSessions, 
  mockQuizAttempts, 
  mockFavoriteTutors 
} from '../data/mockStudentData';

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

  // Authentication check
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    if (!authStatus) {
      setIsAuthenticated(false);
      toast.warning('Bạn cần đăng nhập để truy cập trang này. Đang chuyển hướng...');
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Load state from localStorage or initialize with mock data
  useEffect(() => {
    // 1. Profile
    const localProfile = localStorage.getItem('studentProfile');
    if (localProfile) {
      const parsed = JSON.parse(localProfile);
      setProfile(parsed);
      setFormName(parsed.fullName);
      setFormPhone(parsed.phone);
      setFormGrade(parsed.grade_level || 'Lớp 11');
      setFormGoals(parsed.learning_goals || '');
      setFormSubjects(parsed.preferred_subjects || []);
      setFormMode(parsed.preferred_mode || 'both');
      setFormBudgetMax(Number(parsed.budget_max) || 1000000);
    } else {
      setProfile(initialStudentProfile);
      setFormName(initialStudentProfile.fullName);
      setFormPhone(initialStudentProfile.phone);
      setFormGrade(initialStudentProfile.grade_level || 'Lớp 11');
      setFormGoals(initialStudentProfile.learning_goals || '');
      setFormSubjects(initialStudentProfile.preferred_subjects || []);
      setFormMode(initialStudentProfile.preferred_mode || 'both');
      setFormBudgetMax(Number(initialStudentProfile.budget_max) || 1000000);
      localStorage.setItem('studentProfile', JSON.stringify(initialStudentProfile));
    }

    // 2. Enrolled Courses
    const localCourses = localStorage.getItem('studentEnrolledCourses');
    if (localCourses) {
      setEnrolledCourses(JSON.parse(localCourses));
    } else {
      setEnrolledCourses(mockEnrolledCourses);
      localStorage.setItem('studentEnrolledCourses', JSON.stringify(mockEnrolledCourses));
    }

    // 3. Class Sessions
    const localSessions = localStorage.getItem('studentClassSessions');
    if (localSessions) {
      setClassSessions(JSON.parse(localSessions));
    } else {
      setClassSessions(mockClassSessions);
      localStorage.setItem('studentClassSessions', JSON.stringify(mockClassSessions));
    }

    // 4. Quiz Attempts
    const localQuizzes = localStorage.getItem('studentQuizAttempts');
    if (localQuizzes) {
      setQuizAttempts(JSON.parse(localQuizzes));
    } else {
      setQuizAttempts(mockQuizAttempts);
      localStorage.setItem('studentQuizAttempts', JSON.stringify(mockQuizAttempts));
    }

    // 5. Favorite Tutors
    const localTutors = localStorage.getItem('studentFavoriteTutors');
    if (localTutors) {
      setFavoriteTutors(JSON.parse(localTutors));
    } else {
      setFavoriteTutors(mockFavoriteTutors);
      localStorage.setItem('studentFavoriteTutors', JSON.stringify(mockFavoriteTutors));
    }
  }, []);

  // Update Profile Submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Họ và tên không được để trống.');
      return;
    }

    const updatedProfile: StudentProfile = {
      ...profile,
      fullName: formName,
      phone: formPhone,
      grade_level: formGrade,
      learning_goals: formGoals,
      preferred_subjects: formSubjects,
      preferred_mode: formMode,
      budget_max: formBudgetMax
    };

    setProfile(updatedProfile);
    localStorage.setItem('studentProfile', JSON.stringify(updatedProfile));
    toast.success('Cập nhật hồ sơ thành công!');
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
  const handleRemoveFavorite = (tutorId: string) => {
    const updated = favoriteTutors.filter(t => t.tutor_id !== tutorId);
    setFavoriteTutors(updated);
    localStorage.setItem('studentFavoriteTutors', JSON.stringify(updated));
    toast.info('Đã xóa giảng viên khỏi danh sách yêu thích.');
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
    localStorage.setItem('studentQuizAttempts', JSON.stringify(updated));
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
    localStorage.removeItem('isAuthenticated');
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
      handleLogout
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
