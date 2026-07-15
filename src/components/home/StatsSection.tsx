import React from 'react';

const StatsSection: React.FC = () => {
  const statsList = [
    { number: '25K+', label: 'Học viên đang học' },
    { number: '899', label: 'Tổng số khóa học' },
    { number: '158', label: 'Giảng viên' },
    { number: '100%', label: 'Mức độ hài lòng' }
  ];

  return (
    <section className="stats-section-home" style={{ padding: '20px 0 40px 0' }}>
      <div className="container">
        <div className="stats-grid-home">
          {statsList.map((stat, idx) => (
            <div key={idx} className="stat-card-home">
              <div className="stat-number-home">{stat.number}</div>
              <div className="stat-label-home">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
