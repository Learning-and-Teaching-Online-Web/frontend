import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, MessageCircle, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Youtube, Compass, LogIn, Trash2 } from 'lucide-react';
import { blogApi } from '../services/blogApi';
import authStorage from '../utils/authStorage';
import { renderBlogIllustration } from './BlogList';
import '../styles/Blog.css';

const BlogDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auth states
  const isAuthenticated = authStorage.isAuthenticated();
  const userName = authStorage.getUserName() || 'Người dùng';

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const res = await blogApi.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((art: any) => ({
            ...art,
            content: typeof art.content === 'string' ? JSON.parse(art.content) : art.content,
            tags: typeof art.tags === 'string' ? JSON.parse(art.tags) : art.tags
          }));
          setArticles(mapped);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Find current article
  const article = useMemo(() => {
    if (articles.length === 0) return null;
    return articles.find(a => a.id === articleId) || articles[0];
  }, [articles, articleId]);

  // Find Prev / Next articles
  const prevArticle = useMemo(() => {
    if (articles.length === 0 || !article) return null;
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx <= 0) return articles[articles.length - 1];
    return articles[idx - 1];
  }, [articles, article]);

  const nextArticle = useMemo(() => {
    if (articles.length === 0 || !article) return null;
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx === -1 || idx >= articles.length - 1) return articles[0];
    return articles[idx + 1];
  }, [articles, article]);

  // Comment form states
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Real backend comments list
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);

  // Fetch comments from backend
  const fetchComments = async (artId: string) => {
    try {
      setIsLoadingComments(true);
      const res = await blogApi.getComments(artId);
      if (res && res.success && Array.isArray(res.data)) {
        setCommentsList(res.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (article?.id) {
      fetchComments(article.id);
    }
  }, [article?.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isAuthenticated) {
      setErrorMsg('Bạn cần đăng nhập để gửi bình luận.');
      return;
    }

    if (!commentText.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bình luận.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await blogApi.createComment(article.id, commentText.trim());
      if (res && res.success) {
        setSuccessMsg('Đăng bình luận thành công!');
        setCommentText('');
        fetchComments(article.id);
      } else {
        setErrorMsg(res?.error || 'Không thể đăng bình luận.');
      }
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      const msg = err.response?.data?.error || 'Có lỗi xảy ra khi gửi bình luận.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này không?')) return;
    try {
      const res = await blogApi.deleteComment(commentId);
      if (res && res.success) {
        setCommentsList(prev => prev.filter(c => c.comment_id !== commentId));
      }
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.error || 'Không thể xóa bình luận.');
    }
  };

  if (isLoading) {
    return (
      <div className="blog-detail-page-wrapper" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
        Đang tải bài viết...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="blog-detail-page-wrapper" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Không tìm thấy bài viết yêu cầu. <Link to="/blog">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumbs-separator">/</span>
          <Link to="/blog">Bài viết</Link>
          <span className="breadcrumbs-separator">/</span>
          <span className="breadcrumbs-current">{article.title}</span>
        </div>
      </div>

      <div className="container blog-detail-page-container">
        
        {/* Detail layout wrapper without Sidebar */}
        <div className="blog-detail-layout-wrapper">
          
          <div className="blog-detail-container">
              {/* Title */}
              <h1 className="faq-page-title" style={{ margin: '0 0 16px 0', fontSize: '32px', lineHeight: '1.3' }}>
                {article.title}
              </h1>

              {/* Meta */}
              <div className="blog-detail-meta">
                <span className="meta-item">
                  <User size={14} />
                  {article.author}
                </span>
                <span className="meta-item">
                  <Calendar size={14} />
                  {article.date}
                </span>
                <span className="meta-item">
                  <MessageCircle size={14} />
                  {commentsList.length} Bình luận
                </span>
              </div>

              {/* Image */}
              <div className="blog-detail-large-image">
                {renderBlogIllustration(article.imageType)}
              </div>

              {/* Body */}
              <div className="blog-detail-body">
                {article.content.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="blog-detail-tags">
                <span className="blog-detail-tags-title">Thẻ:</span>
                {article.tags.map((tag: string, idx: number) => (
                  <span className="blog-detail-tag" key={idx}>{tag}</span>
                ))}
              </div>

              {/* Social Share */}
              <div className="blog-detail-share">
                <span className="blog-detail-share-title">Chia sẻ:</span>
                <div className="footer-socials" style={{ margin: 0, display: 'inline-flex' }}>
                  <a href="#" className="social-icon-btn" aria-label="Facebook"><Facebook size={14} /></a>
                  <a href="#" className="social-icon-btn" aria-label="Pinterest"><Compass size={14} /></a>
                  <a href="#" className="social-icon-btn" aria-label="Twitter"><Twitter size={14} /></a>
                  <a href="#" className="social-icon-btn" aria-label="Instagram"><Instagram size={14} /></a>
                  <a href="#" className="social-icon-btn" aria-label="Youtube"><Youtube size={14} /></a>
                </div>
              </div>

              {/* Prev / Next Article navigators */}
              <div className="prev-next-articles">
                <Link 
                  to={`/blog/${prevArticle.id}`}
                  className="prev-next-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="prev-next-arrow-btn">
                    <ChevronLeft size={16} />
                  </div>
                  <div className="prev-next-content">
                    <span className="prev-next-label">Bài viết trước</span>
                    <h4 className="prev-next-title">{prevArticle.title}</h4>
                  </div>
                </Link>

                <Link 
                  to={`/blog/${nextArticle.id}`}
                  className="prev-next-card"
                  style={{ flexDirection: 'row-reverse', textAlign: 'right', textDecoration: 'none' }}
                >
                  <div className="prev-next-arrow-btn">
                    <ChevronRight size={16} />
                  </div>
                  <div className="prev-next-content" style={{ alignItems: 'flex-end' }}>
                    <span className="prev-next-label">Bài viết tiếp theo</span>
                    <h4 className="prev-next-title">{nextArticle.title}</h4>
                  </div>
                </Link>
              </div>

              {/* Comments list */}
              <div className="blog-comments-section">
                <h3 className="comments-title">{commentsList.length} Bình luận</h3>
                
                {isLoadingComments ? (
                  <p style={{ color: 'var(--text-muted)' }}>Đang tải bình luận...</p>
                ) : commentsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                ) : (
                  <div className="comments-list">
                    {commentsList.map((comment) => (
                      <div className="comment-item" key={comment.comment_id}>
                        <div className="comment-avatar">
                          <img 
                            src={comment.user?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                            alt={comment.user?.full_name || 'Avatar'} 
                          />
                        </div>
                        
                        <div className="comment-content">
                          <div className="comment-meta">
                            <span className="comment-author-name">{comment.user?.full_name || 'Người dùng'}</span>
                            <span className="comment-post-date">
                              {new Date(comment.created_at).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="comment-text">{comment.content}</p>
                          
                          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <span 
                              className="comment-reply-link"
                              onClick={() => {
                                setCommentText(`@${comment.user?.full_name} `);
                                document.getElementById('comment-form-title')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Trả lời
                            </span>
                            
                            {(authStorage.getUserRole() === 'admin') && (
                              <span 
                                style={{ color: '#ef4444', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                onClick={() => handleDeleteComment(comment.comment_id)}
                              >
                                <Trash2 size={13} /> Xóa
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leave A Comment Section */}
              <div className="leave-comment-section" id="comment-form-container">
                <h3 className="form-title" id="comment-form-title">Để lại bình luận</h3>
                
                {!isAuthenticated ? (
                  <div style={{ padding: '24px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-md)', textAlign: 'center', margin: '20px 0', border: '1px dashed var(--border)' }}>
                    <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 500 }}>
                      🔒 Bạn cần đăng nhập để tham gia bình luận bài viết này.
                    </p>
                    <button 
                      className="contact-submit-btn" 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                      onClick={() => navigate('/auth')}
                    >
                      <LogIn size={18} /> Đăng nhập ngay
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="form-subtitle" style={{ marginBottom: '16px' }}>
                      Bình luận với tài khoản: <strong style={{ color: 'var(--primary)' }}>{userName}</strong>
                    </p>

                    {errorMsg && (
                      <div className="contact-alert contact-alert-error">
                        <AlertCircle className="contact-alert-icon" size={18} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="contact-alert contact-alert-success">
                        <CheckCircle2 className="contact-alert-icon" size={18} />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleCommentSubmit} noValidate>
                      <div className="contact-form-textarea">
                        <textarea 
                          className="form-input" 
                          placeholder="Viết bình luận của bạn..." 
                          rows={4}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang gửi...' : 'Đăng bình luận'}
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
