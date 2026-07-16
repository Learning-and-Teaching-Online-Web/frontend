import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { blogApi } from '../../services/blogApi';
import { renderBlogIllustration } from '../../pages/BlogList';

const LatestArticles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setIsLoading(true);
        const res = await blogApi.getAll();
        if (res && res.success && Array.isArray(res.data)) {
          setArticles(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching latest articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  const latestThree = articles;

  return (
    <section className="latest-articles-section" style={{ padding: '40px 0 80px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Bài viết mới nhất</h2>
            <p>Khám phá các bài viết miễn phí của chúng tôi</p>
          </div>
          <Link to="/blog" className="section-header-btn">
            Tất cả bài viết
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid-home">
          {isLoading ? (
            <div style={{ width: '100%', gridColumn: 'span 3', padding: '40px 0', textAlign: 'center', color: 'var(--primary)', fontWeight: 600 }}>
              Đang tải danh sách bài viết...
            </div>
          ) : latestThree.length > 0 ? (
            latestThree.map((article) => (
              <article key={article.id} className="blog-card">
                {/* Image */}
                <Link 
                  to={`/blog/${article.id}`}
                  className="blog-card-image" 
                  style={{ display: 'block', height: '180px', cursor: 'pointer' }}
                >
                  {renderBlogIllustration(article.imageType)}
                </Link>

                {/* Content */}
                <div className="blog-card-content" style={{ padding: '20px' }}>
                  {/* Meta */}
                  <div className="blog-card-meta" style={{ marginBottom: '8px' }}>
                    <span className="meta-item">
                      <Calendar size={13} style={{ color: 'var(--primary)' }} />
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="blog-card-title" style={{ fontSize: '16px', marginBottom: '8px' }}>
                    <Link to={`/blog/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="blog-card-excerpt" style={{ fontSize: '13px', marginBottom: 0 }}>
                    {article.excerpt}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div style={{ width: '100%', gridColumn: 'span 3', padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              Chưa có bài viết nào được đăng tải.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default LatestArticles;
