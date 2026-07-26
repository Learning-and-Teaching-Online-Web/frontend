import React from 'react';
import { Plus, Edit2, Trash2, FileText, X } from 'lucide-react';

interface ArticlesTabProps {
  articles: any[];
  openCreateArticleModal: () => void;
  openEditArticleModal: (article: any) => void;
  handleDeleteArticle: (id: string, title: string) => void;
  // Modal props
  isArticleModalOpen: boolean;
  setIsArticleModalOpen: (open: boolean) => void;
  editingArticle: any | null;
  articleTitle: string; setArticleTitle: (v: string) => void;
  articleCategory: string; setArticleCategory: (v: string) => void;
  articleImageType: string; setArticleImageType: (v: string) => void;
  articleExcerpt: string; setArticleExcerpt: (v: string) => void;
  articleContent: string; setArticleContent: (v: string) => void;
  articleTags: string; setArticleTags: (v: string) => void;
  handleArticleSubmit: (e: React.FormEvent) => void;
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

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  openCreateArticleModal,
  openEditArticleModal,
  handleDeleteArticle,
  isArticleModalOpen,
  setIsArticleModalOpen,
  editingArticle,
  articleTitle, setArticleTitle,
  articleCategory, setArticleCategory,
  articleImageType, setArticleImageType,
  articleExcerpt, setArticleExcerpt,
  articleContent, setArticleContent,
  articleTags, setArticleTags,
  handleArticleSubmit
}) => {
  return (
    <div className="section-card">
      <div className="section-header">
        <h2>Bài viết chia sẻ của tôi</h2>
        <button className="btn-primary-db" onClick={openCreateArticleModal}>
          <Plus size={16} /> Đăng bài viết mới
        </button>
      </div>

      <div className="table-responsive">
        <table className="db-table">
          <thead>
            <tr>
              <th>Tiêu đề bài viết</th>
              <th>Thể loại</th>
              <th>Ngày đăng</th>
              <th>Lượt bình luận</th>
              <th style={{ textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art: any) => (
              <tr key={art.id}>
                <td style={{ maxWidth: '300px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {art.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {art.excerpt}
                  </div>
                </td>
                <td>
                  <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
                    {art.category}
                  </span>
                </td>
                <td>{art.date}</td>
                <td>{art.commentsCount || 0} bình luận</td>
                <td>
                  <div className="actions-group" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn-secondary-db"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => openEditArticleModal(art)}
                    >
                      <Edit2 size={13} /> Sửa
                    </button>
                    <button
                      className="btn-action-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                  Bạn chưa có bài viết nào. Hãy bấm "Đăng bài viết mới" để chia sẻ kiến thức với học viên!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="modal-card" style={{
            backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '12px',
            width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto',
            padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5' }}>
                <FileText size={20} />
                <span>{editingArticle ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới'}</span>
              </h3>
              <button onClick={() => setIsArticleModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleArticleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Tiêu đề bài viết <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tiêu đề bài viết..."
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Thể loại <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Hình minh họa (SVG)
                  </label>
                  <select
                    className="form-input"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    value={articleImageType}
                    onChange={(e) => setArticleImageType(e.target.value)}
                  >
                    {IMAGE_TYPE_OPTIONS.map(img => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Thẻ Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Mẹo học, Phương pháp, Kỹ năng..."
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  value={articleTags}
                  onChange={(e) => setArticleTags(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Đoạn tóm tắt (Excerpt) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nhập đoạn tóm tắt ngắn..."
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  value={articleExcerpt}
                  onChange={(e) => setArticleExcerpt(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  Nội dung chi tiết <span style={{ color: '#ef4444' }}>*</span> (Cách nhau bởi dòng trống)
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Nhập nội dung bài viết..."
                  className="form-input"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setIsArticleModalOpen(false)} className="btn-secondary-db">
                  Hủy
                </button>
                <button type="submit" className="btn-primary-db">
                  {editingArticle ? 'Lưu thay đổi' : 'Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
