import React from 'react';

const StatsSection: React.FC = () => {
  const statsList = [
    { number: '25K+', label: 'Active Students' },
    { number: '899', label: 'Total Courses' },
    { number: '158', label: 'Instructor' },
    { number: '100%', label: 'Satisfaction Rate' }
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
