import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  colorClass: string; // 'courses' | 'lessons' | 'quiz' | 'hours'
  label: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  colorClass,
  label,
  value
}) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>
        {icon}
      </div>
      <div className="stat-info">
        <h4>{label}</h4>
        <span>{value}</span>
      </div>
    </div>
  );
};
