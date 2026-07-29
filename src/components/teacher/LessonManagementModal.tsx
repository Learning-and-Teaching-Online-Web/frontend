import React from 'react';
import { X, Plus, Video, BookOpen, Trash2, ExternalLink, Edit2, Check } from 'lucide-react';

interface LessonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: any | null;
  lessons: any[];
  newLessonTitle: string;
  setNewLessonTitle: (v: string) => void;
  newLessonUrl: string;
  setNewLessonUrl: (v: string) => void;
  newLessonDesc: string;
  setNewLessonDesc: (v: string) => void;
  editingLesson?: any | null;
  onEditLesson?: (les: any) => void;
  onCancelEdit?: () => void;
  handleAddLessonSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteLesson: (id: string, title: string) => Promise<void>;
}

export const LessonManagementModal: React.FC<LessonManagementModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  lessons,
  newLessonTitle,
  setNewLessonTitle,
  newLessonUrl,
  setNewLessonUrl,
  newLessonDesc,
  setNewLessonDesc,
  editingLesson,
  onEditLesson,
  onCancelEdit,
  handleAddLessonSubmit,
  handleDeleteLesson
}) => {
  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '800px', width: '95%' }}>
        <div className="modal-header">
          <div>
            <h3>Quản lý Bài giảng Video (Khóa Offline)</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500 }}>
              Khóa học: <strong>{selectedCourse.title}</strong> ({selectedCourse.type === 'offline' ? 'Offline Video' : 'Online Live'})
            </span>
          </div>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* SECTION 1: FORM ADD / EDIT LESSON */}
          <div style={{
            background: editingLesson ? '#f5f3ff' : 'var(--bg-dashboard)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: editingLesson ? '1.5px solid #8b5cf6' : '1px solid var(--border-light)',
            transition: 'all 0.2s ease'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {editingLesson ? (
                <>
                  <Edit2 size={16} style={{ color: '#7c3aed' }} /> Chỉnh sửa bài giảng: <span style={{ color: '#6d28d9' }}>{editingLesson.title}</span>
                </>
              ) : (
                <>
                  <Plus size={16} style={{ color: '#4f46e5' }} /> Thêm bài giảng Video mới
                </>
              )}
            </h4>
            
            <form onSubmit={handleAddLessonSubmit}>
              <div className="form-group-db">
                <label>Tên bài giảng / Tiêu đề bài học *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bài 1: Tổng quan & Cú pháp cơ bản..."
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                />
              </div>

              <div className="form-group-db">
                <label>Đường dẫn Video bài giảng (Youtube Embed / Cloud URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newLessonUrl}
                  onChange={(e) => setNewLessonUrl(e.target.value)}
                />
              </div>

              <div className="form-group-db">
                <label>Mô tả tóm tắt nội dung bài học</label>
                <textarea
                  rows={2}
                  placeholder="Nhập ghi chú hoặc kiến thức trọng tâm bài học..."
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                {editingLesson && onCancelEdit && (
                  <button
                    type="button"
                    className="btn-secondary-db"
                    onClick={onCancelEdit}
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                  >
                    Hủy chỉnh sửa
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary-db"
                  style={editingLesson ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}}
                >
                  {editingLesson ? (
                    <>
                      <Check size={16} /> Cập nhật bài giảng
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Đăng bài giảng
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: CURRENT LESSONS LIST */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} style={{ color: '#4f46e5' }} /> Danh sách bài giảng ({lessons.length})
            </h4>

            {lessons.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lessons.map((les: any, idx: number) => {
                  const id = les.lesson_id || les.doc_id;
                  const isBeingEdited = editingLesson && (editingLesson.lesson_id === id || editingLesson.doc_id === id);
                  return (
                    <div key={id || idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: isBeingEdited ? '#f5f3ff' : 'white',
                      border: isBeingEdited ? '1.5px solid #8b5cf6' : '1px solid var(--border-main)',
                      borderRadius: '10px',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Video size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-dark)' }}>
                            Bài {idx + 1}: {les.title}
                            {isBeingEdited && (
                              <span style={{ fontSize: '11px', background: '#7c3aed', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: 500 }}>
                                Đang sửa
                              </span>
                            )}
                          </div>
                          {les.description && (
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                              {les.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        {(les.video_url || les.file_url) && (
                          <a
                            href={les.video_url || les.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '12px',
                              color: '#4f46e5',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              textDecoration: 'none',
                              background: 'rgba(99, 102, 241, 0.08)',
                              padding: '5px 10px',
                              borderRadius: '6px'
                            }}
                          >
                            Xem Video <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => onEditLesson && onEditLesson(les)}
                          className="btn-secondary-db"
                          style={{ padding: '5px 10px', fontSize: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', border: '1px solid rgba(99, 102, 241, 0.2)' }}
                          title="Sửa bài giảng này"
                        >
                          <Edit2 size={13} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(id, les.title)}
                          className="btn-action-danger"
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                          title="Xóa bài giảng này"
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-dashboard)', borderRadius: '10px', color: 'var(--text-light)', fontSize: '13px' }}>
                Chưa có bài giảng video nào trong khóa này. Hãy điền đường dẫn Video bài giảng ở trên để tải bài học đầu tiên!
              </div>
            )}
          </div>

        </div>

        <div className="modal-actions" style={{ marginTop: '16px' }}>
          <button type="button" className="btn-secondary-db" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
