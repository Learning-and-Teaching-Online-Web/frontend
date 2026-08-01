import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tutorApi from '../services/tutorApi';
import { courseApi } from '../services/courseApi';
import { blogApi, type CreateArticlePayload } from '../services/blogApi';
import { authApi } from '../services/authApi';
import authStorage from '../utils/authStorage';

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  activeSchedules: number;
}

export type TeacherTab = 'overview' | 'courses' | 'schedules' | 'bookings' | 'articles' | 'reviews' | 'wallet' | 'profile';

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
  const [tutorProfile, setTutorProfile] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [classSessions, setClassSessions] = useState<any[]>([]);

  // Tutor Profile
  const [teacherName, setTeacherName] = useState('Gia sư NovaLearn');

  // Modal Open States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Form States - Certificate
  const [certTitle, setCertTitle] = useState('');
  const [certFileUrl, setCertFileUrl] = useState('');
  const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null);
  const [certFileType, setCertFileType] = useState('PDF');
  const [certIssuedBy, setCertIssuedBy] = useState('');
  const [certIssuedDate, setCertIssuedDate] = useState('');
  const [certExpiryDate, setCertExpiryDate] = useState('');

  // Form & Modal States - Course Lessons
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<any | null>(null);
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  // Modal 6: Document Management (For Online Courses)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [courseDocuments, setCourseDocuments] = useState<any[]>([]);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocFileBase64, setNewDocFileBase64] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');
  const [newDocType, setNewDocType] = useState('pdf');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [editingDocument, setEditingDocument] = useState<any | null>(null);

  // Form States - Course
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubject, setNewCourseSubject] = useState('Lập trình & Web');
  const [newCoursePrice, setNewCoursePrice] = useState(300000);
  const [newCourseType, setNewCourseType] = useState<'online' | 'offline'>('online');
  const [newCourseStartDate, setNewCourseStartDate] = useState('');
  const [newCourseEndDate, setNewCourseEndDate] = useState('');
  const [newCourseDurationMonths, setNewCourseDurationMonths] = useState<number>(3);
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner');
  const [newCourseSessions, setNewCourseSessions] = useState(10);
  const [newCourseDuration, setNewCourseDuration] = useState(90);
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseThumbnail, setNewCourseThumbnail] = useState('');
  const [newCourseMaxStudents, setNewCourseMaxStudents] = useState<number>(1);
  const [newCourseStatus, setNewCourseStatus] = useState<'published' | 'draft'>('published');
  const [newCourseScheduleDays, setNewCourseScheduleDays] = useState<number[]>([1, 3, 5]); // 1=Mon, 3=Wed, 5=Fri
  const [newCourseStartTime, setNewCourseStartTime] = useState<string>('19:30');
  const [newCourseEndTime, setNewCourseEndTime] = useState<string>('21:00');


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
      // 0. Fetch My Profile & Certificates
      const profileRes = await tutorApi.getMyProfile();
      if (profileRes.success) setTutorProfile(profileRes.data);

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

      // 6. Fetch Class Sessions
      const sessionsRes = await tutorApi.getClassSessions();
      if (sessionsRes.success) {
        setClassSessions(sessionsRes.data || []);
      }

      // 7. Fetch Articles
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



  // Auto-calculate live sessions for online courses based on dates and selected days
  useEffect(() => {
    if (newCourseType === 'online' && newCourseStartDate && newCourseEndDate && newCourseScheduleDays.length > 0) {
      const start = new Date(newCourseStartDate + 'T12:00:00Z');
      const end = new Date(newCourseEndDate + 'T12:00:00Z');
      if (end >= start) {
        let count = 0;
        let curr = new Date(start);
        while (curr <= end) {
          if (newCourseScheduleDays.includes(curr.getDay())) {
            count++;
          }
          curr.setDate(curr.getDate() + 1);
        }
        setNewCourseSessions(count);
      }
    }
  }, [newCourseType, newCourseStartDate, newCourseEndDate, newCourseScheduleDays]);

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

  const isApprovedTutor = tutorProfile?.verified_status === 'approved' || authStorage.getUserRole() === 'admin';

  // Course Handlers
  const openCreateCourseModal = () => {
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên. Không thể tạo khóa học!');
      return;
    }
    setEditingCourse(null);
    setNewCourseTitle('');
    setNewCourseSubject('Lập trình & Web');
    setNewCoursePrice(300000);
    setNewCourseType('online');
    setNewCourseStartDate('');
    setNewCourseEndDate('');
    setNewCourseDurationMonths(3);
    setNewCourseLevel('Beginner');
    setNewCourseSessions(10);
    setNewCourseDuration(90);
    setNewCourseDescription('');
    setNewCourseThumbnail('');
    setNewCourseMaxStudents(1);
    setNewCourseStatus('published');
    setNewCourseScheduleDays([1, 3, 5]);
    setNewCourseStartTime('19:30');
    setNewCourseEndTime('21:00');
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: any) => {
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
    setEditingCourse(course);
    setNewCourseTitle(course.title || '');
    setNewCourseSubject(course.subject || 'Lập trình & Web');
    setNewCoursePrice(Number(course.price) || 300000);
    setNewCourseType(course.type || 'online');
    setNewCourseStartDate(course.start_date ? course.start_date.split('T')[0] : '');
    setNewCourseEndDate(course.end_date ? course.end_date.split('T')[0] : '');
    setNewCourseDurationMonths(course.duration_months || 3);
    setNewCourseLevel(course.level || 'Beginner');
    setNewCourseSessions(course.total_sessions || 10);
    setNewCourseDuration(course.duration_minutes || 90);
    setNewCourseDescription(course.description || '');
    setNewCourseThumbnail(course.thumbnail_url || '');
    setNewCourseMaxStudents(course.max_students || 1);
    setNewCourseStatus(course.status || 'published');
    
    if (course.schedules && course.schedules.length > 0) {
      const days = [...new Set(course.schedules.map((s: any) => s.day_of_week))];
      setNewCourseScheduleDays(days as number[]);
      
      const firstSchedule = course.schedules[0];
      const startD = new Date(firstSchedule.start_time);
      const endD = new Date(firstSchedule.end_time);
      setNewCourseStartTime(`${startD.getHours().toString().padStart(2, '0')}:${startD.getMinutes().toString().padStart(2, '0')}`);
      setNewCourseEndTime(`${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`);
    } else {
      setNewCourseScheduleDays([1, 3, 5]);
      setNewCourseStartTime('19:30');
      setNewCourseEndTime('21:00');
    }
    
    setIsCourseModalOpen(true);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
    if (!newCourseTitle.trim()) {
      toast.error('Vui lòng nhập tên khóa học');
      return;
    }

    try {
      const payload: any = {
        title: newCourseTitle.trim(),
        subject: newCourseSubject,
        description: newCourseDescription.trim() || undefined,
        price: Number(newCoursePrice),
        type: newCourseType,
        level: newCourseLevel,
        duration_minutes: Number(newCourseDuration),
        total_sessions: Number(newCourseSessions),
        max_students: Number(newCourseMaxStudents) || 1,
        thumbnail_url: newCourseThumbnail.trim() || undefined,
        status: newCourseStatus
      };

      if (newCourseType === 'online') {
        if (!newCourseStartDate || !newCourseEndDate) {
          toast.error('Vui lòng chọn ngày khai giảng và bế giảng!');
          return;
        }
        if (new Date(newCourseEndDate) <= new Date(newCourseStartDate)) {
          toast.error('Ngày bế giảng phải sau ngày khai giảng!');
          return;
        }
        if (newCourseScheduleDays.length === 0 || !newCourseStartTime || !newCourseEndTime) {
          toast.error('Vui lòng chọn khung giờ học và các ngày dạy trong tuần!');
          return;
        }
        payload.start_date = newCourseStartDate || undefined;
        payload.end_date = newCourseEndDate || undefined;
        payload.duration_months = Number(newCourseDurationMonths) || undefined;
      }

      const generateAndAddSchedules = async (courseId: string) => {
        if (newCourseType === 'online' && courseId && newCourseStartDate && newCourseEndDate && newCourseScheduleDays.length > 0 && newCourseStartTime && newCourseEndTime) {
          const startD = new Date(newCourseStartDate);
          const autoSlots: any[] = [];

          const yyyy = startD.getFullYear();
          const mm = String(startD.getMonth() + 1).padStart(2, '0');
          const dd = String(startD.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;

          const startISO = `${dateStr}T${newCourseStartTime}:00+07:00`;
          const endISO = `${dateStr}T${newCourseEndTime}:00+07:00`;

          for (const dayOfWeek of newCourseScheduleDays) {
            autoSlots.push({
              start_time: startISO,
              end_time: endISO,
              is_recurring: true,
              day_of_week: dayOfWeek,
              recurrence_end: newCourseEndDate,
              max_slot: Number(newCourseMaxStudents) || 1
            });
          }

          if (autoSlots.length > 0) {
            let createdCount = 0;
            for (const slot of autoSlots) {
              try {
                await tutorApi.addSchedule(courseId, slot);
                createdCount++;
              } catch (e: any) {
                toast.warning(`Không thể xếp lịch thứ ${slot.day_of_week === 0 ? 'Chủ Nhật' : slot.day_of_week + 1}: ${e.response?.data?.error || 'Trùng lịch'}`);
              }
            }
            if (createdCount > 0) {
              toast.success(`Đã lưu ${createdCount} cấu hình lịch tuần hoàn!`);
            }
          }
        }
      };

      if (editingCourse) {
        await tutorApi.updateCourse(editingCourse.course_id, payload);
        
        if (newCourseType === 'online' && editingCourse.status !== 'published') {
          try {
            await tutorApi.deleteCourseSchedules(editingCourse.course_id);
            await generateAndAddSchedules(editingCourse.course_id);
          } catch (e) {
            console.error('Lỗi cập nhật lịch dạy:', e);
          }
        }
        
        toast.success('Cập nhật khóa học thành công!');
      } else {
        const createRes = await tutorApi.createCourse(payload);
        const createdCourseId = createRes?.data?.course_id || createRes?.data?.id;

        await generateAndAddSchedules(createdCourseId);

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
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${title}"?`)) return;
    try {
      await tutorApi.deleteCourse(courseId);
      toast.success('Xóa khóa học thành công!');
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Xóa khóa học thất bại.');
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
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên. Không thể đăng bài viết!');
      return;
    }
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
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
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
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
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
    if (!isApprovedTutor) {
      toast.error('Hồ sơ gia sư của bạn chưa được duyệt bởi Quản trị viên.');
      return;
    }
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

  // ==============================================================
  // Document Management Handlers (For Online Courses)
  // ==============================================================
  const openDocumentsModal = async (course: any) => {
    setSelectedCourseForLessons(course);
    setEditingDocument(null);
    setNewDocTitle('');
    setNewDocUrl('');
    setNewDocFileBase64('');
    setNewDocFileName('');
    setNewDocType('pdf');
    setNewDocDesc('');
    setIsDocumentModalOpen(true);
    try {
      const docsRes = await courseApi.getCourseDocuments(course.course_id);
      if (docsRes && docsRes.success) {
        setCourseDocuments(docsRes.data || []);
      } else {
        setCourseDocuments([]);
      }
    } catch (err) {
      setCourseDocuments([]);
    }
  };

  const handleEditDocument = (doc: any) => {
    setEditingDocument(doc);
    setNewDocTitle(doc.title || '');
    setNewDocUrl(doc.file_url || '');
    setNewDocFileBase64('');
    setNewDocFileName('');
    setNewDocType(doc.file_type || 'pdf');
    setNewDocDesc(doc.description || '');
  };

  const cancelEditDocument = () => {
    setEditingDocument(null);
    setNewDocTitle('');
    setNewDocUrl('');
    setNewDocFileBase64('');
    setNewDocFileName('');
    setNewDocType('pdf');
    setNewDocDesc('');
  };

  const handleAddDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLessons) return;
    try {
      if (editingDocument) {
        await courseApi.updateCourseDocument(editingDocument.doc_id, {
          title: newDocTitle,
          file_url: newDocUrl,
          file_type: newDocType,
          description: newDocDesc,
          ...(newDocFileBase64 ? { file_base64: newDocFileBase64, file_name: newDocFileName } : {})
        });
        toast.success('Cập nhật tài liệu thành công!');
      } else {
        await courseApi.addCourseDocument(selectedCourseForLessons.course_id, {
          title: newDocTitle,
          file_url: newDocUrl,
          file_type: newDocType,
          description: newDocDesc,
          ...(newDocFileBase64 ? { file_base64: newDocFileBase64, file_name: newDocFileName } : {})
        });
        toast.success('Thêm tài liệu mới thành công!');
      }
      const docsRes = await courseApi.getCourseDocuments(selectedCourseForLessons.course_id);
      setCourseDocuments(docsRes.data || []);
      cancelEditDocument();
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu tài liệu');
    }
  };

  const handleDeleteDocument = async (docId: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}"?`)) return;
    try {
      await courseApi.deleteCourseDocument(docId);
      toast.success('Đã xóa tài liệu!');
      setCourseDocuments(prev => prev.filter(d => d.doc_id !== docId));
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi xóa tài liệu');
    }
  };

  // Profile & Certificate Handlers
  const handleUpdateProfileSubmit = async (data: any) => {
    try {
      if (data.avatarUrl) {
        await authApi.updateProfile({ avatarUrl: data.avatarUrl });
      }
      const res = await tutorApi.updateMyProfile(data);
      if (res && res.success) {
        window.dispatchEvent(new Event('authChange'));
        toast.success('Cập nhật thông tin hồ sơ thành công!');
        loadDashboardData();
      } else {
        toast.error(res?.error || 'Không thể cập nhật hồ sơ.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    }
  };

  const openAddCertModal = () => {
    setCertTitle('');
    setCertFileUrl('');
    setSelectedCertFile(null);
    setCertFileType('PDF');
    setCertIssuedBy('');
    setCertIssuedDate('');
    setCertExpiryDate('');
    setIsCertModalOpen(true);
  };

  const handleAddCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) {
      toast.error('Vui lòng nhập Tên chứng chỉ/bằng cấp.');
      return;
    }

    if (!selectedCertFile && !certFileUrl.trim()) {
      toast.error('Vui lòng chọn tệp chứng chỉ từ máy tính hoặc cung cấp đường dẫn tệp.');
      return;
    }

    try {
      if (selectedCertFile) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Str = reader.result as string;
            const res = await tutorApi.addCertificate({
              title: certTitle.trim(),
              file_base64: base64Str,
              file_name: selectedCertFile.name,
              file_type: certFileType,
              issued_by: certIssuedBy.trim() || undefined,
              issued_date: certIssuedDate || undefined,
              expiry_date: certExpiryDate || undefined
            });

            if (res && res.success) {
              toast.success('Đã tải lên tệp chứng chỉ tới Supabase Storage! Đang chờ Admin xét duyệt.');
              setIsCertModalOpen(false);
              setSelectedCertFile(null);
              loadDashboardData();
            } else {
              toast.error(res?.error || 'Gửi chứng chỉ thất bại.');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.error || 'Không thể tải lên tệp chứng chỉ.');
          }
        };
        reader.readAsDataURL(selectedCertFile);
      } else {
        const res = await tutorApi.addCertificate({
          title: certTitle.trim(),
          file_url: certFileUrl.trim(),
          file_type: certFileType,
          issued_by: certIssuedBy.trim() || undefined,
          issued_date: certIssuedDate || undefined,
          expiry_date: certExpiryDate || undefined
        });

        if (res && res.success) {
          toast.success('Gửi chứng chỉ mới thành công! Đang chờ Admin xét duyệt.');
          setIsCertModalOpen(false);
          loadDashboardData();
        } else {
          toast.error(res?.error || 'Gửi chứng chỉ thất bại.');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể gửi chứng chỉ.');
    }
  };

  const handleDeleteCert = async (certId: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa chứng chỉ "${title}"?`)) return;
    try {
      const res = await tutorApi.deleteCertificate(certId);
      if (res && res.success) {
        toast.success('Xóa chứng chỉ thành công!');
        loadDashboardData();
      } else {
        toast.error(res?.error || 'Xóa chứng chỉ thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể xóa chứng chỉ.');
    }
  };

  // Lesson Management Handlers (CourseLesson video lectures)
  const openLessonsModal = async (course: any) => {
    setSelectedCourseForLessons(course);
    setEditingLesson(null);
    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonDesc('');
    setIsLessonModalOpen(true);
    try {
      const detailRes = await courseApi.getDetail(course.course_id);
      if (detailRes && detailRes.success && detailRes.data) {
        setCourseLessons(detailRes.data.lessons || []);
      } else {
        setCourseLessons(course.lessons || []);
      }
    } catch (err) {
      setCourseLessons(course.lessons || []);
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setNewLessonTitle(lesson.title || '');
    setNewLessonUrl(lesson.video_url || '');
    setNewLessonDesc(lesson.description || '');
  };

  const cancelEditLesson = () => {
    setEditingLesson(null);
    setNewLessonTitle('');
    setNewLessonUrl('');
    setNewLessonDesc('');
  };

  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLessons) return;
    if (!newLessonTitle.trim() || !newLessonUrl.trim()) {
      toast.error('Vui lòng nhập Tên bài học và Đường dẫn Video.');
      return;
    }

    try {
      let res;
      if (editingLesson) {
        res = await courseApi.updateLesson(selectedCourseForLessons.course_id, editingLesson.lesson_id, {
          title: newLessonTitle.trim(),
          video_url: newLessonUrl.trim(),
          description: newLessonDesc.trim() || undefined
        });
      } else {
        res = await courseApi.addLesson(selectedCourseForLessons.course_id, {
          title: newLessonTitle.trim(),
          video_url: newLessonUrl.trim(),
          description: newLessonDesc.trim() || undefined
        });
      }

      if (res && res.success) {
        toast.success(editingLesson ? 'Cập nhật bài giảng video thành công!' : 'Đăng bài giảng video mới thành công!');
        setEditingLesson(null);
        setNewLessonTitle('');
        setNewLessonUrl('');
        setNewLessonDesc('');
        // Refresh lessons list
        const detailRes = await courseApi.getDetail(selectedCourseForLessons.course_id);
        if (detailRes && detailRes.success && detailRes.data) {
          setCourseLessons(detailRes.data.lessons || []);
        }
        loadDashboardData();
      } else {
        toast.error(res?.error || (editingLesson ? 'Không thể cập nhật bài giảng.' : 'Không thể tạo bài giảng.'));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi lưu bài giảng video.');
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!selectedCourseForLessons) return;
    if (!window.confirm(`Bạn có chắc muốn xóa bài giảng "${title}"?`)) return;
    try {
      const res = await courseApi.deleteLesson(selectedCourseForLessons.course_id, lessonId);
      if (res && res.success) {
        toast.success('Xóa bài giảng video thành công!');
        setCourseLessons(prev => prev.filter(l => l.lesson_id !== lessonId));
        if (editingLesson && editingLesson.lesson_id === lessonId) {
          cancelEditLesson();
        }
        loadDashboardData();
      } else {
        toast.error(res?.error || 'Xóa bài giảng thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Có lỗi xảy ra khi xóa bài giảng.');
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

  const handleStartDateChange = (val: string) => {
    setNewCourseStartDate(val);
    if (val && newCourseEndDate) {
      const start = new Date(val);
      const end = new Date(newCourseEndDate);
      if (end <= start) {
        toast.warning('Ngày bế giảng phải sau ngày khai giảng!');
      } else {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.round((diffDays / 30) * 10) / 10;
        setNewCourseDurationMonths(months > 0 ? months : 1);
      }
    }
  };

  const handleEndDateChange = (val: string) => {
    setNewCourseEndDate(val);
    if (newCourseStartDate && val) {
      const start = new Date(newCourseStartDate);
      const end = new Date(val);
      if (end <= start) {
        toast.warning('Ngày bế giảng phải sau ngày khai giảng!');
      } else {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.round((diffDays / 30) * 10) / 10;
        setNewCourseDurationMonths(months > 0 ? months : 1);
      }
    }
  };

  const handleDurationMonthsChange = (val: number) => {
    setNewCourseDurationMonths(val);
    if (newCourseStartDate && val > 0) {
      const start = new Date(newCourseStartDate);
      start.setMonth(start.getMonth() + Math.floor(val));
      const additionalDays = Math.round((val - Math.floor(val)) * 30);
      start.setDate(start.getDate() + additionalDays);
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      setNewCourseEndDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    teacherName,
    stats,
    tutorProfile,
    isApprovedTutor,
    handleStartDateChange,
    handleEndDateChange,
    handleDurationMonthsChange,
    courses,
    bookings,
    reviews,
    transactions,
    walletBalance,
    articles,
    allSchedules,
    classSessions,
    formatVND,
    formatDateString,
    // Lesson Management
    isLessonModalOpen, setIsLessonModalOpen,
    selectedCourseForLessons, setSelectedCourseForLessons,
    courseLessons, setCourseLessons,
    newLessonTitle, setNewLessonTitle,
    newLessonUrl, setNewLessonUrl,
    newLessonDesc, setNewLessonDesc,
    editingLesson,
    openLessonsModal,
    handleEditLesson,
    cancelEditLesson,
    handleAddLessonSubmit,
    handleDeleteLesson,
    // Document Management
    isDocumentModalOpen, setIsDocumentModalOpen,
    courseDocuments, setCourseDocuments,
    newDocTitle, setNewDocTitle,
    newDocUrl, setNewDocUrl,
    newDocFileBase64, setNewDocFileBase64,
    newDocFileName, setNewDocFileName,
    newDocType, setNewDocType,
    newDocDesc, setNewDocDesc,
    editingDocument,
    openDocumentsModal,
    handleEditDocument,
    cancelEditDocument,
    handleAddDocumentSubmit,
    handleDeleteDocument,
    // Profile & Certificate Handlers
    handleUpdateProfileSubmit,
    isCertModalOpen, setIsCertModalOpen,
    certTitle, setCertTitle,
    certFileUrl, setCertFileUrl,
    selectedCertFile, setSelectedCertFile,
    certFileType, setCertFileType,
    certIssuedBy, setCertIssuedBy,
    certIssuedDate, setCertIssuedDate,
    certExpiryDate, setCertExpiryDate,
    openAddCertModal,
    handleAddCertSubmit,
    handleDeleteCert,
    // Modals & Course Actions
    isCourseModalOpen, setIsCourseModalOpen,
    editingCourse, setEditingCourse,
    openCreateCourseModal,
    openEditCourseModal,
    handleCourseSubmit,
    handleDeleteCourse,

    isWithdrawModalOpen, setIsWithdrawModalOpen,
    isArticleModalOpen, setIsArticleModalOpen,
    editingArticle,
    // Course form
    newCourseTitle, setNewCourseTitle,
    newCourseSubject, setNewCourseSubject,
    newCoursePrice, setNewCoursePrice,
    newCourseType, setNewCourseType,
    newCourseStartDate, setNewCourseStartDate,
    newCourseEndDate, setNewCourseEndDate,
    newCourseDurationMonths, setNewCourseDurationMonths,
    newCourseLevel, setNewCourseLevel,
    newCourseSessions, setNewCourseSessions,
    newCourseDuration, setNewCourseDuration,
    newCourseDescription, setNewCourseDescription,
    newCourseThumbnail, setNewCourseThumbnail,
    newCourseMaxStudents, setNewCourseMaxStudents,
    newCourseStatus, setNewCourseStatus,
    newCourseScheduleDays, setNewCourseScheduleDays,
    newCourseStartTime, setNewCourseStartTime,
    newCourseEndTime, setNewCourseEndTime,

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
