import React from 'react';
import { Calendar } from 'lucide-react';
import { mockArticles } from '../../data/blogData';
import { renderBlogIllustration } from '../BlogList';

interface LatestArticlesProps {
  onSelectArticle: (articleId: string) => void;
  onViewAll: () => void;
}

const LatestArticles: React.FC<LatestArticlesProps> = ({ onSelectArticle, onViewAll }) => {
  // Take the first 3 articles for the home page display
  const latestThree = mockArticles.slice(0, 3);

  return (
    <section className="latest-articles-section" style={{ padding: '40px 0 80px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row">
          <div className="section-title-group">
            <h2>Latest Articles</h2>
            <p>Explore our Free Articles</p>
          </div>
          <button className="section-header-btn" onClick={onViewAll}>
            All Articles
          </button>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid-home">
          {latestThree.map((article) => (
            <article key={article.id} className="blog-card">
              {/* Image */}
              <div 
                className="blog-card-image" 
                onClick={() => onSelectArticle(article.id)}
                style={{ cursor: 'pointer', height: '180px' }}
              >
                {renderBlogIllustration(article.imageType)}
              </div>

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
                  <a href="#" onClick={(e) => { e.preventDefault(); onSelectArticle(article.id); }}>
                    {article.title}
                  </a>
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
