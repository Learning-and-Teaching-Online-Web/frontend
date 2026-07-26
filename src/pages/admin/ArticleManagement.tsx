import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogApi, type CreateArticlePayload } from '../../services/blogApi';
import { Search, Plus, Edit2, Trash2, X, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import authStorage from '../../utils/authStorage';

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content: any;
  date: string;
  author: string;
  commentsCount: number;
  category: string;
  imageType: string;
  tags: any;
  created_at: string;
}

const CATEGORY_OPTIONS = [
  'Mẹo học tập',
  'Tin tức & Sự kiện',
  'Phương pháp giảng dạy',
  'Định hướng nghề nghiệp',
  'Công nghệ giáo dục'
];

const IMAGE_TYPE_OPTIONS = [
  { label: 'Quả địa cầu (Globe)', value: 'globe' },
  { label: 'Lớp học (Classroom)', value: 'classroom' },
  { label: 'Văn phòng (Office)', value: 'office' },
  { label: 'Máy tính bảng (Tablet)', value: 'tablet' },
  { label: 'Trẻ em / Học sinh (Child)', value: 'child' },
  { label: 'Thư viện sách (Library)', value: 'library' }
];

const ArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: CATEGORY_OPTIONS[0],
    imageType: 'globe',
    author: '',
    tags: '',
    content: ''
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getAll();
      if (response && response.success && Array.isArray(response.data)) {
        setArticles(response.data);
      } else {
        toast.error('Lấy danh sách bài viết thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ khi lấy danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      excerpt: '',
      category: CATEGORY_OPTIONS[0],
      imageType: 'globe',
      author: authStorage.getUserName() || 'Admin',
      tags: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article: ArticleItem) => {
    setEditingArticle(article);
    
    let contentStr = '';
    if (Array.isArray(article.content)) {
      contentStr = article.content.join('\n\n');
    } else if (typeof article.content === 'string') {
      try {
        const parsed = JSON.parse(article.content);
        contentStr = Array.isArray(parsed) ? parsed.join('\n\n') : article.content;
      } catch {
        contentStr = article.content;
      }
    }

    let tagsStr = '';
    if (Array.isArray(article.tags)) {
      tagsStr = article.tags.join(', ');
    } else if (typeof article.tags === 'string') {
      try {
        const parsed = JSON.parse(article.tags);
        tagsStr = Array.isArray(parsed) ? parsed.join(', ') : article.tags;
      } catch {
        tagsStr = article.tags;
      }
    }

    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      category: article.category || CATEGORY_OPTIONS[0],
      imageType: article.imageType || 'globe',
      author: article.author || '',
      tags: tagsStr,
      content: contentStr
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error('Vui lòng điền đầy đủ Tiêu đề, Tóm tắt và Nội dung bài viết.');
      return;
    }

    const paragraphs = formData.content
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const tagList = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: CreateArticlePayload = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: paragraphs,
      category: formData.category,
      imageType: formData.imageType,
      author: formData.author.trim() || 'Admin',
      tags: tagList
    };

    setFormSubmitLoading(true);
    try {
      if (editingArticle) {
        // Update
        const res = await blogApi.update(editingArticle.id, payload);
        if (res && res.success) {
          toast.success('Cập nhật bài viết thành công!');
          closeModal();
          fetchArticles();
        } else {
          toast.error(res?.error || 'Cập nhật bài viết thất bại.');
        }
      } else {
        // Create
        const res = await blogApi.create(payload);
        if (res && res.success) {
          toast.success('Tạo bài viết mới thành công!');
          closeModal();
          fetchArticles();
        } else {
          toast.error(res?.error || 'Tạo bài viết thất bại.');
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" không?`)) {
      return;
    }

    try {
      const res = await blogApi.delete(id);
      if (res && res.success) {
        toast.success('Xóa bài viết thành công!');
        fetchArticles();
      } else {
        toast.error(res?.error || 'Xóa bài viết thất bại.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Có lỗi xảy ra khi xóa bài viết.');
    }
  };

  // Filter articles by search and category
  const filteredArticles = articles.filter(art => {
    const matchesSearch = !search || 
      art.title.toLowerCase().includes(search.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || art.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout title="Quản lý bài viết Blog">
      <div className="admin-card">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flexGrow: 1, maxWidth: '600px' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            </div>

            <select
              className="admin-select-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={openCreateModal}
            className="admin-btn primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <Plus size={18} />
            <span>Tạo bài viết mới</span>
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ color: 'var(--admin-text-muted)', padding: '20px 0' }}>Đang tải danh sách bài viết...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bài viết</th>
                  <th>Thể loại</th>
                  <th>Tác giả</th>
                  <th>Ngày tạo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles && filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <tr key={article.id}>
                      <td style={{ maxWidth: '320px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {article.excerpt}
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge primary" style={{ fontSize: '11px' }}>
                          {article.category}
                        </span>
                      </td>
                      <td>{article.author}</td>
                      <td>{article.date}</td>
                      <td>
                        <div className="admin-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button onClick={() => openEditModal(article)} className="admin-btn sm primary" title="Sửa bài viết">
                            <Edit2 size={14} />
                            <span>Sửa</span>
                          </button>
                          <button onClick={() => handleDelete(article.id, article.title)} className="admin-btn sm danger" title="Xóa bài viết">
                            <Trash2 size={14} />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '30px' }}>
                      Không tìm thấy bài viết nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            border: '1px solid #334155',
            padding: '24px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="var(--admin-primary, #6366f1)" size={20} />
                <span>{editingArticle ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</span>
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Tiêu đề bài viết <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề bài viết..."
                  className="admin-search-input"
                  style={{ width: '100%' }}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Category & ImageType Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Thể loại <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="admin-select-filter"
                    style={{ width: '100%' }}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Hình minh họa (SVG Illustration)
                  </label>
                  <select
                    className="admin-select-filter"
                    style={{ width: '100%' }}
                    value={formData.imageType}
                    onChange={(e) => setFormData({ ...formData, imageType: e.target.value })}
                  >
                    {IMAGE_TYPE_OPTIONS.map(img => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Tags Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Tác giả
                  </label>
                  <input
                    type="text"
                    placeholder="Tên tác giả..."
                    className="admin-search-input"
                    style={{ width: '100%' }}
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Thẻ Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="Mẹo học, Tiếng Anh, Lập trình..."
                    className="admin-search-input"
                    style={{ width: '100%' }}
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Đoạn tóm tắt bài viết (Excerpt) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nhập đoạn giới thiệu ngắn hiển thị trên thẻ bài viết..."
                  className="admin-search-input"
                  style={{ width: '100%', minHeight: '60px', fontFamily: 'inherit' }}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              {/* Content */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Nội dung chi tiết bài viết <span style={{ color: '#ef4444' }}>*</span> (Các đoạn văn cách nhau bằng dòng trống)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Nhập nội dung chi tiết bài viết..."
                  className="admin-search-input"
                  style={{ width: '100%', minHeight: '180px', fontFamily: 'inherit', lineHeight: '1.5' }}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
                <button type="button" onClick={closeModal} className="admin-btn secondary">
                  Hủy
                </button>
                <button type="submit" disabled={formSubmitLoading} className="admin-btn primary">
                  {formSubmitLoading ? 'Đang lưu...' : (editingArticle ? 'Lưu thay đổi' : 'Đăng bài viết')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ArticleManagement;
