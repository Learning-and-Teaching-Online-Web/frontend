import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { mockArticles } from '../../data/blogData';
import { renderBlogIllustration } from '../../pages/BlogList';

const LatestArticles: React.FC = () => {
  // Take the first 3 articles for the home page display
  const latestThree = mockArticles.slice(0, 3);

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
          {latestThree.map((article) => (
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
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestArticles;
