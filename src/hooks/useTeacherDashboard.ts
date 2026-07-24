import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tutorApi from '../services/tutorApi';
import { blogApi, type CreateArticlePayload } from '../services/blogApi';
import authStorage from '../utils/authStorage';

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  activeSchedules: number;
}

export type TeacherTab = 'overview' | 'courses' | 'schedules' | 'bookings' | 'articles' | 'reviews' | 'wallet';

export const useTeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Core Data States
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeSchedules: 0
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [articles, setArticles] = useState<any[]>([]);

  // Tutor Profile
  const [teacherName, setTeacherName] = useState('Gia sư NovaLearn');

  // Modal Open States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);

  // Form States - Course
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubject, setNewCourseSubject] = useState('Lập trình & Web');
  const [newCoursePrice, setNewCoursePrice] = useState(300000);
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner');
  const [newCourseSessions, setNewCourseSessions] = useState(10);
  const [newCourseDuration, setNewCourseDuration] = useState(90);

  // Form States - Schedule
  const [scheduleCourseId, setScheduleCourseId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('2026-07-20');
  const [scheduleStart, setScheduleStart] = useState('09:00');
  const [scheduleEnd, setScheduleEnd] = useState('10:30');

  // Form States - Withdrawal
  const [withdrawAmount, setWithdrawAmount] = useState(500000);
  const [withdrawBank, setWithdrawBank] = useState('Techcombank');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  // Form States - Article
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('Mẹo học tập');
  const [articleImageType, setArticleImageType] = useState('globe');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleTags, setArticleTags] = useState('');

  // Load all dashboard data from API
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await tutorApi.getStats();
      if (statsRes.success) setStats(statsRes.data);

      // 2. Fetch Courses
      const coursesRes = await tutorApi.getMyCourses();
      if (coursesRes.success) setCourses(coursesRes.data || []);

      // 3. Fetch Bookings
      const bookingsRes = await tutorApi.getBookings();
      if (bookingsRes.success) setBookings(bookingsRes.data || []);

      // 4. Fetch Reviews
      const reviewsRes = await tutorApi.getReviews();
      if (reviewsRes.success) setReviews(reviewsRes.data || []);

      // 5. Fetch Wallet Balance & Transactions
      const walletRes = await tutorApi.getWallet();
      if (walletRes.success) {
        setWalletBalance(walletRes.data.balance);
        setTransactions(walletRes.data.transactions || []);
      }

      // 6. Fetch Articles (Filtered to tutor's own articles unless admin)
      const articlesRes = await blogApi.getAll();
      if (articlesRes && articlesRes.success && Array.isArray(articlesRes.data)) {
        const currentTeacherName = authStorage.getUserName() || teacherName;
        const currentRole = authStorage.getUserRole();

        if (currentRole === 'admin') {
          setArticles(articlesRes.data);
        } else {
          const myArticles = articlesRes.data.filter((art: any) =>
            art.author && art.author.toLowerCase().trim() === currentTeacherName.toLowerCase().trim()
          );
          setArticles(myArticles);
        }
      }
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error(error.response?.data?.error || 'Không thể đồng bộ dữ liệu từ hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = authStorage.isAuthenticated();
    const role = authStorage.getUserRole();
    const name = authStorage.getUserName();

    if (!auth) {
      toast.warning('Vui lòng đăng nhập để truy cập kênh gia sư.');
      navigate('/auth');
      return;
    }

    if (role !== 'tutor' && role !== 'admin') {
      toast.error('Tài khoản của bạn không có quyền truy cập kênh gia sư.');
      navigate('/');
      return;
    }

    if (name) {
      setTeacherName(name);
    }

    loadDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (courses.length > 0 && !scheduleCourseId) {
      setScheduleCourseId(courses[0].course_id);
    }
  }, [courses, scheduleCourseId]);

  // Helpers
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const formatDateString = (isoString: string) => {
    if (!isoString) return 'Chưa xác định';
    const d = new Date(isoString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} lúc ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Action Handlers
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await tutorApi.updateBookingStatus(bookingId, 'confirmed');
      toast.success('Phê duyệt yêu cầu đăng ký học thành công!');
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể phê duyệt booking này.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await tutorApi.updateBookingStatus(bookingId, 'cancelled');
      toast.info('Đã từ chối/hủy yêu cầu đăng ký.');
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể từ chối booking này.');
    }
  };

  // Course Handlers
  const openCreateCourseModal = () => {
    setEditingCourse(null);
    setNewCourseTitle('');
    setNewCourseSubject('Lập trình & Web');
    setNewCoursePrice(300000);
    setNewCourseLevel('Beginner');
    setNewCourseSessions(10);
    setNewCourseDuration(90);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: any) => {
    setEditingCourse(course);
    setNewCourseTitle(course.title || '');
    setNewCourseSubject(course.subject || 'Lập trình & Web');
    setNewCoursePrice(Number(course.price) || 300000);
    setNewCourseLevel(course.level || 'Beginner');
    setNewCourseSessions(course.total_sessions || 10);
    setNewCourseDuration(course.duration_minutes || 90);
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      toast.error('Vui lòng nhập tên khóa học');
      return;
    }

    try {
      const payload = {
        title: newCourseTitle.trim(),
        subject: newCourseSubject,
        price: Number(newCoursePrice),
        level: newCourseLevel,
        duration_minutes: Number(newCourseDuration),
        total_sessions: Number(newCourseSessions)
      };

      if (editingCourse) {
        await tutorApi.updateCourse(editingCourse.course_id, payload);
        toast.success('Cập nhật khóa học thành công!');
      } else {
        await tutorApi.createCourse(payload);
        toast.success('Tạo khóa học mới thành công!');
      }

      setIsCourseModalOpen(false);
      setEditingCourse(null);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || (editingCourse ? 'Cập nhật thất bại.' : 'Tạo khóa học mới thất bại.'));
    }
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${title}"?`)) return;
    try {
      await tutorApi.deleteCourse(courseId);
      toast.success('Xóa khóa học thành công!');
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Xóa khóa học thất bại.');
    }
  };

  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleCourseId) {
      toast.error('Vui lòng chọn khóa học');
      return;
    }

    const startISO = `${scheduleDate}T${scheduleStart}:00+07:00`;
    const endISO = `${scheduleDate}T${scheduleEnd}:00+07:00`;

    try {
      await tutorApi.addSchedule(scheduleCourseId, {
        start_time: startISO,
        end_time: endISO,
        is_recurring: false,
        max_slot: 1
      });

      toast.success('Đã thêm khung giờ dạy mới!');
      setIsScheduleModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể thêm khung giờ dạy.');
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      toast.error('Số tiền rút phải lớn hơn 0');
      return;
    }
    if (withdrawAmount > walletBalance) {
      toast.error('Số dư ví không đủ để rút số tiền này.');
      return;
    }
    if (!withdrawAccount.trim()) {
      toast.error('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }

    try {
      await tutorApi.requestWithdrawal({
        amount: Number(withdrawAmount),
        bankName: withdrawBank,
        bankAccount: withdrawAccount
      });

      toast.success('Đã gửi yêu cầu rút tiền thành công!');
      setIsWithdrawModalOpen(false);
      setWithdrawAccount('');
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Rút tiền thất bại.');
    }
  };

  // Article Modal Handlers
  const openCreateArticleModal = () => {
    setEditingArticle(null);
    setArticleTitle('');
    setArticleCategory('Mẹo học tập');
    setArticleImageType('globe');
    setArticleExcerpt('');
    setArticleContent('');
    setArticleTags('');
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (article: any) => {
    setEditingArticle(article);
    setArticleTitle(article.title || '');
    setArticleCategory(article.category || 'Mẹo học tập');
    setArticleImageType(article.imageType || 'globe');
    setArticleExcerpt(article.excerpt || '');
    
    let contentStr = '';
    if (Array.isArray(article.content)) {
      contentStr = article.content.join('\n\n');
    } else {
      contentStr = article.content || '';
    }
    setArticleContent(contentStr);

    let tagsStr = '';
    if (Array.isArray(article.tags)) {
      tagsStr = article.tags.join(', ');
    } else {
      tagsStr = article.tags || '';
    }
    setArticleTags(tagsStr);

    setIsArticleModalOpen(true);
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleExcerpt.trim() || !articleContent.trim()) {
      toast.error('Vui lòng nhập đầy đủ Tiêu đề, Tóm tắt và Nội dung.');
      return;
    }

    const paragraphs = articleContent
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const tagList = articleTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: CreateArticlePayload = {
      title: articleTitle.trim(),
      excerpt: articleExcerpt.trim(),
      content: paragraphs,
      category: articleCategory,
      imageType: articleImageType,
      author: teacherName,
      tags: tagList
    };

    try {
      if (editingArticle) {
        const res = await blogApi.update(editingArticle.id, payload);
        if (res && res.success) {
          toast.success('Cập nhật bài viết thành công!');
          setIsArticleModalOpen(false);
          loadDashboardData();
        } else {
          toast.error(res?.error || 'Cập nhật bài viết thất bại.');
        }
      } else {
        const res = await blogApi.create(payload);
        if (res && res.success) {
          toast.success('Đăng bài viết mới thành công!');
          setIsArticleModalOpen(false);
          loadDashboardData();
        } else {
          toast.error(res?.error || 'Đăng bài viết thất bại.');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu bài viết.');
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await blogApi.delete(id);
      if (res && res.success) {
        toast.success('Xóa bài viết thành công!');
        loadDashboardData();
      } else {
        toast.error(res?.error || 'Xóa bài viết thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi xóa bài viết.');
    }
  };

  const allSchedules = courses.reduce((acc: any[], course) => {
    const courseSchedules = (course.schedules || []).map((sch: any) => ({
      ...sch,
      course_title: course.title,
      course_id: course.course_id
    }));
    return [...acc, ...courseSchedules];
  }, []);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    teacherName,
    stats,
    courses,
    bookings,
    reviews,
    transactions,
    walletBalance,
    articles,
    allSchedules,
    formatVND,
    formatDateString,
    // Modals & Course Actions
    isCourseModalOpen, setIsCourseModalOpen,
    editingCourse, setEditingCourse,
    openCreateCourseModal,
    openEditCourseModal,
    handleCourseSubmit,
    handleDeleteCourse,
    isScheduleModalOpen, setIsScheduleModalOpen,
    isWithdrawModalOpen, setIsWithdrawModalOpen,
    isArticleModalOpen, setIsArticleModalOpen,
    editingArticle,
    // Course form
    newCourseTitle, setNewCourseTitle,
    newCourseSubject, setNewCourseSubject,
    newCoursePrice, setNewCoursePrice,
    newCourseLevel, setNewCourseLevel,
    newCourseSessions, setNewCourseSessions,
    newCourseDuration, setNewCourseDuration,
    // Schedule form
    scheduleCourseId, setScheduleCourseId,
    scheduleDate, setScheduleDate,
    scheduleStart, setScheduleStart,
    scheduleEnd, setScheduleEnd,
    handleAddScheduleSubmit,
    // Withdraw form
    withdrawAmount, setWithdrawAmount,
    withdrawBank, setWithdrawBank,
    withdrawAccount, setWithdrawAccount,
    handleWithdrawSubmit,
    // Article form
    articleTitle, setArticleTitle,
    articleCategory, setArticleCategory,
    articleImageType, setArticleImageType,
    articleExcerpt, setArticleExcerpt,
    articleContent, setArticleContent,
    articleTags, setArticleTags,
    openCreateArticleModal,
    openEditArticleModal,
    handleArticleSubmit,
    handleDeleteArticle,
    // Booking actions
    handleConfirmBooking,
    handleCancelBooking
  };
};
