import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, MessageCircle, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Youtube, Compass } from 'lucide-react';
import { mockArticles, mockComments } from '../data/blogData';
import type { BlogComment } from '../data/blogData';
import { renderBlogIllustration } from './BlogList';
import '../styles/Blog.css';

const BlogDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();

  // Find current article
  const article = useMemo(() => {
    return mockArticles.find(a => a.id === articleId) || mockArticles[0];
  }, [articleId]);

  // Find Prev / Next articles
  const prevArticle = useMemo(() => {
    const idx = mockArticles.findIndex(a => a.id === article.id);
    if (idx <= 0) return mockArticles[mockArticles.length - 1];
    return mockArticles[idx - 1];
  }, [article]);

  const nextArticle = useMemo(() => {
    const idx = mockArticles.findIndex(a => a.id === article.id);
    if (idx === -1 || idx >= mockArticles.length - 1) return mockArticles[0];
    return mockArticles[idx + 1];
  }, [article]);



  // Leave a Comment form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Comments list with new user comments capability
  const [commentsList, setCommentsList] = useState<BlogComment[]>(mockComments);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập email.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Định dạng email không hợp lệ.');
      return;
    }
    if (!commentText.trim()) {
      setErrorMsg('Vui lòng nhập bình luận.');
      return;
    }

    // Append new comment
    const newComment: BlogComment = {
      id: `custom-comment-${Date.now()}`,
      authorName: name,
      date: 'Just now',
      content: commentText,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' // default male avatar
    };

    setCommentsList(prev => [...prev, newComment]);
    setSuccessMsg('Đăng bình luận thành công!');
    setName('');
    setEmail('');
    setCommentText('');
  };

  return (
    <div className="blog-detail-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container breadcrumbs-container">
          <Link to="/">Homepage</Link>
          <span className="breadcrumbs-separator">/</span>
          <Link to="/blog">Blog</Link>
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
                  {commentsList.length} Comments
                </span>
              </div>

              {/* Image */}
              <div className="blog-detail-large-image">
                {renderBlogIllustration(article.imageType)}
              </div>

              {/* Body */}
              <div className="blog-detail-body">
                {article.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="blog-detail-tags">
                <span className="blog-detail-tags-title">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <span className="blog-detail-tag" key={idx}>{tag}</span>
                ))}
              </div>

              {/* Social Share */}
              <div className="blog-detail-share">
                <span className="blog-detail-share-title">Share:</span>
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
                    <span className="prev-next-label">Prev Articles</span>
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
                    <span className="prev-next-label">Next Articles</span>
                    <h4 className="prev-next-title">{nextArticle.title}</h4>
                  </div>
                </Link>
              </div>

              {/* Comments list */}
              <div className="blog-comments-section">
                <h3 className="comments-title">{commentsList.length} Comments</h3>
                
                <div className="comments-list">
                  {commentsList.map((comment) => (
                    <div className="comment-item" key={comment.id}>
                      <div className="comment-avatar">
                        <img src={comment.avatarUrl} alt={comment.authorName} />
                      </div>
                      
                      <div className="comment-content">
                        <div className="comment-meta">
                          <span className="comment-author-name">{comment.authorName}</span>
                          <span className="comment-post-date">{comment.date}</span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                        <span 
                          className="comment-reply-link"
                          onClick={() => {
                            setCommentText(`@${comment.authorName} `);
                            document.getElementById('comment-form-title')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Reply
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave A Comment Form */}
              <div className="leave-comment-section" id="comment-form-container">
                <h3 className="form-title" id="comment-form-title">Leave A Comment</h3>
                <p className="form-subtitle">Your email address will not be published. Required fields are marked *</p>

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
                  <div className="contact-form-inputs">
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Name*" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="Email*" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form-textarea">
                    <textarea 
                      className="form-input" 
                      placeholder="Comment" 
                      rows={6}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    />
                  </div>

                  <label className="contact-form-checkbox">
                    <input 
                      type="checkbox" 
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                    <span>Save my name, email in this browser for the next time I comment</span>
                  </label>

                  <button type="submit" className="contact-submit-btn">
                    Posts Comment
                  </button>
                </form>
              </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
