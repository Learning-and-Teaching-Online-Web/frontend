import React from 'react';
import { X, Plus, FileText, Trash2, ExternalLink, Edit2, FileArchive, FileSpreadsheet, Check } from 'lucide-react';

interface DocumentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: any | null;
  documents: any[];
  newDocTitle: string;
  setNewDocTitle: (v: string) => void;
  newDocUrl: string;
  setNewDocUrl: (v: string) => void;
  newDocFileBase64?: string;
  setNewDocFileBase64?: (v: string) => void;
  newDocFileName?: string;
  setNewDocFileName?: (v: string) => void;
  newDocType: string;
  setNewDocType: (v: string) => void;
  newDocDesc: string;
  setNewDocDesc: (v: string) => void;
  editingDocument?: any | null;
  onEditDocument?: (doc: any) => void;
  onCancelEdit?: () => void;
  handleAddDocumentSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteDocument: (id: string, title: string) => Promise<void>;
}

export const DocumentManagementModal: React.FC<DocumentManagementModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  documents,
  newDocTitle,
  setNewDocTitle,
  newDocUrl,
  setNewDocUrl,
  // newDocFileBase64, // unused
  setNewDocFileBase64,
  newDocFileName,
  setNewDocFileName,
  newDocType,
  setNewDocType,
  newDocDesc,
  setNewDocDesc,
  editingDocument,
  onEditDocument,
  onCancelEdit,
  handleAddDocumentSubmit,
  handleDeleteDocument
}) => {
  if (!isOpen || !selectedCourse) return null;

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText size={18} color="#ef4444" />;
      case 'docx': return <FileText size={18} color="#3b82f6" />;
      case 'pptx': return <FileText size={18} color="#f97316" />;
      case 'xlsx': return <FileSpreadsheet size={18} color="#10b981" />;
      case 'zip': return <FileArchive size={18} color="#8b5cf6" />;
      default: return <FileText size={18} color="#64748b" />;
    }
  };

  const [uploadMethod, setUploadMethod] = React.useState<'url' | 'file'>('file');

  // Switch upload method automatically if editing and has URL but no file
  React.useEffect(() => {
    if (editingDocument && editingDocument.file_url && !editingDocument.file_url.includes('supabase')) {
      setUploadMethod('url');
    } else {
      setUploadMethod('file');
    }
  }, [editingDocument]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 10MB');
      e.target.value = '';
      return;
    }

    if (setNewDocFileName) {
      setNewDocFileName(file.name);
    }
    
    // Auto-detect file type
    if (setNewDocType) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext && ['pdf', 'docx', 'pptx', 'xlsx', 'zip', 'txt'].includes(ext)) {
        setNewDocType(ext);
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      if (setNewDocFileBase64) {
        setNewDocFileBase64(base64String);
      }
      if (setNewDocUrl) {
        setNewDocUrl(''); // clear url if file is selected
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '800px', width: '95%' }}>
        <div className="modal-header">
          <div>
            <h3>Quản lý Tài liệu / Giáo trình (Khóa Online)</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500 }}>
              Khóa học: <strong>{selectedCourse.title}</strong>
            </span>
          </div>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* SECTION 1: FORM ADD / EDIT DOCUMENT */}
          <div style={{
            background: editingDocument ? '#f0fdf4' : 'var(--bg-dashboard)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: editingDocument ? '1.5px solid #22c55e' : '1px solid var(--border-light)',
            transition: 'all 0.2s ease'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {editingDocument ? (
                <>
                  <Edit2 size={16} style={{ color: '#16a34a' }} /> Chỉnh sửa tài liệu: <span style={{ color: '#15803d' }}>{editingDocument.title}</span>
                </>
              ) : (
                <>
                  <Plus size={16} style={{ color: '#10b981' }} /> Thêm tài liệu mới
                </>
              )}
            </h4>
            
            <form onSubmit={handleAddDocumentSubmit}>
              <div className="form-group-db">
                <label>Tên tài liệu / giáo trình *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Giáo trình Lập trình Web - Tập 1..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-dark)' }}>
                  <input type="radio" checked={uploadMethod === 'file'} onChange={() => setUploadMethod('file')} />
                  Tải file từ máy tính (Max 10MB)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-dark)' }}>
                  <input type="radio" checked={uploadMethod === 'url'} onChange={() => setUploadMethod('url')} />
                  Nhập link Google Drive / Cloud
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '15px' }}>
                <div className="form-group-db">
                  <label>Nguồn tài liệu *</label>
                  {uploadMethod === 'file' ? (
                    <div style={{ border: '1px dashed var(--border-light)', padding: '8px', borderRadius: '8px', background: '#fff' }}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt"
                        onChange={handleFileChange}
                        style={{ border: 'none', padding: 0, outline: 'none' }}
                        required={!newDocUrl && !editingDocument}
                      />
                      {newDocFileName && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>Đã chọn: {newDocFileName}</div>}
                    </div>
                  ) : (
                    <input
                      type="url"
                      required={uploadMethod === 'url'}
                      placeholder="https://drive.google.com/file/d/..."
                      value={newDocUrl}
                      onChange={(e) => {
                        setNewDocUrl(e.target.value);
                        if (setNewDocFileBase64) setNewDocFileBase64('');
                        if (setNewDocFileName) setNewDocFileName('');
                      }}
                    />
                  )}
                </div>
                <div className="form-group-db">
                  <label>Loại File</label>
                  <select 
                    value={newDocType} 
                    onChange={(e) => setNewDocType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)',
                      backgroundColor: '#fff',
                      fontSize: '14px',
                      color: 'var(--text-dark)',
                      outline: 'none'
                    }}
                  >
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="pptx">PowerPoint (.pptx)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="zip">Nén (.zip)</option>
                    <option value="txt">Text (.txt)</option>
                  </select>
                </div>
              </div>

              <div className="form-group-db">
                <label>Mô tả tóm tắt nội dung tài liệu</label>
                <textarea
                  rows={2}
                  placeholder="Tài liệu này bao gồm..."
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary-db" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', background: editingDocument ? '#22c55e' : '#10b981' }}>
                  {editingDocument ? <Check size={16} /> : <Plus size={16} />}
                  {editingDocument ? 'Lưu thay đổi' : 'Thêm tài liệu'}
                </button>
                {editingDocument && (
                  <button type="button" className="btn-secondary-db" onClick={onCancelEdit} style={{ flex: 1 }}>
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* SECTION 2: LIST OF DOCUMENTS */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '12px' }}>
              Danh sách Tài liệu đã tải lên ({documents?.length || 0})
            </h4>
            
            {documents && documents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {documents.map((doc: any, index: number) => (
                  <div key={doc.doc_id || index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#fff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px', 
                        background: 'var(--bg-dashboard)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        {getFileIcon(doc.file_type || 'pdf')}
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--text-dark)' }}>
                          {doc.title}
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '11px', color: '#64748b' }}>{doc.file_type || 'PDF'}</span>
                          {doc.description && (
                            <>
                              <span>•</span>
                              <span>{doc.description.length > 50 ? doc.description.substring(0, 50) + '...' : doc.description}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {doc.file_url && (
                        <a 
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-db"
                          style={{ padding: '6px', minWidth: 'auto', color: '#3b82f6', border: '1px solid #bfdbfe', background: '#eff6ff' }}
                          title="Xem File"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <button
                        className="btn-secondary-db"
                        style={{ padding: '6px', minWidth: 'auto' }}
                        title="Chỉnh sửa tài liệu"
                        onClick={() => onEditDocument && onEditDocument(doc)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-action-danger"
                        style={{ padding: '6px', minWidth: 'auto' }}
                        title="Xóa tài liệu"
                        onClick={() => handleDeleteDocument(doc.doc_id, doc.title)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-dashboard)', borderRadius: '12px', border: '1px dashed var(--border-light)' }}>
                <FileText size={32} color="#cbd5e1" style={{ marginBottom: '10px' }} />
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '14px' }}>Khóa học này chưa có tài liệu nào.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
